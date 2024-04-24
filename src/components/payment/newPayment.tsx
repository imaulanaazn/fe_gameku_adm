import {
  Card,
  CardContent,
  Grid,
  CardHeader,
  Box,
  Avatar,
  Typography,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { currencyConverter } from "@/@core/utils/currencyConverter";
import dayjs from "dayjs";
import { OrderStatuses, OrderType, PaymentsCategory } from "@/enum";
import { useQRCode } from "next-qrcode";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const getStatusPayment = (
  status: OrderStatuses,
  type: OrderType,
  expiredAt: string
) => {
  let msg;
  let msgBox;
  let severity;
  switch (status) {
    case OrderStatuses.PENDING_PAYMENT:
      msg =
        "Silahkan lakukan pembayaran sebelum agar orderanmu segera diproses";
      msg += `. Pembayaranmu akan expired pada ${dayjs(expiredAt).format(
        "DD MMMM YYYY HH:mm:ss"
      )}`;
      msgBox = "Menunggu Pembayaran";
      severity = "info";
      break;
    case OrderStatuses.EXPIRED:
      msg =
        "Pesananmu sudah expired pada " +
        dayjs(expiredAt).format("DD MMMM YYYY HH:mm:ss");
      severity = "error";
      msgBox = "Kadaluarsa";
      break;
    case OrderStatuses.PENDING_ORDER:
    case OrderStatuses.PROCESSING:
      msg =
        "Pesananmu sedang kami proses secepatnya. Terima kasih sudah menunggu";
      severity = "info";
      msgBox = "Sedang Diproses";
      break;
    case OrderStatuses.SUCCESS:
      msg =
        "Pesananmu sudah selesai, terima kasih sudah order denom di GASSKEUN TOPUP";
      severity = "success";
      msgBox = "Berhasil";
      break;
    default:
      msg =
        "Pesananmu gagal diproses. Jika sudah dibayar silahkan hubungi admin";
      severity = "error";
      msgBox = "Gagal";
      break;
  }

  return {
    alert: <Alert severity={severity as any}>{msg}</Alert>,
    box: msgBox,
  };
};

const getTitlePayment = (category: string): string => {
  let str: string;
  switch (category) {
    case PaymentsCategory.RETAIL:
    case PaymentsCategory.VIRTUAL_ACCOUNT:
      str = "Kode Pembayaran";
      break;
    case PaymentsCategory.QRIS:
      str = "Scan QR untuk bayar";
    default:
      str = "Pembayaran";
      break;
  }

  return str;
};

const NewPayment = ({ invoices }: { invoices: IInvoice }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { Canvas } = useQRCode();
  const [logoGasskeun, setLogoGasskeun] = useState("");
  const [order, setOrder] = useState<IInvoice | null>(invoices);
  const [isFinished, setIsFinished] = useState(false);

  if (invoices.status === OrderStatuses.SUCCESS) {
    router.push(`/payment/${invoices.invoiceId}/success`);
  }

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const getLogo = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      setLogoGasskeun(res[0].value);
    }
  };

  const getOrder = async (fromInterval: boolean) => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/order-detail/" +
        invoices.invoiceId,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );
    const res = await req.json();
    setOrder(res);
    setIsFinished(fromInterval);
  };

  useEffect(() => {
    getLogo();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isFinished && ["3", "4", "5", "6"].includes(order?.status || "")) {
        clearInterval(interval);
        return;
      }

      if (!isFinished) {
        await getOrder(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order?.status, isFinished]);
  return (
    <Grid container spacing={6}>
      {order && (
        <>
          <Grid item xs={12} md={7}>
            <Card sx={{ position: "relative" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                      src={order.logoGame}
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.25px",
                          fontWeight: 600,
                          marginTop: 1.5,
                        }}
                      >
                        {order.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.25px",
                          fontWeight: 600,
                          marginTop: 1.5,
                        }}
                      >
                        {order.game}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "gray", marginTop: 1.5 }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, marginTop: 1.5 }}
                    >
                      {currencyConverter(order.totalAmt)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                  {(order.detail?.userId ||
                    order.detail?.serverId ||
                    order.detail?.username) && (
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Data game :
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={6}>
                  <Grid item xs={6} md={2}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {order.detail?.userId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          User ID
                        </Typography>
                      )}
                      {order.detail?.serverId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          Server ID
                        </Typography>
                      )}
                      {order.detail?.username && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          Username
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box>
                      {order.detail?.userId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          : {order.detail?.userId}
                        </Typography>
                      )}
                      {order.detail?.serverId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          : {order.detail?.serverId}
                        </Typography>
                      )}
                      {order.detail?.username && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, marginTop: 2 }}
                        >
                          : {order.detail?.username}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ position: "relative", marginTop: 4 }}>
              {/* <CardHeader title='Informasi Pembayaran' titleTypographyProps={{ fontSize: 40 }} /> */}
              <CardContent>
                <Box sx={{ marginBottom: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Informasi Pembayaran
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {order.productName}
                  </Typography>
                  <Typography variant="body2">
                    {currencyConverter(order.detail ? order.detail.amount : 0)}
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Kuantitas</Typography>
                  <Typography variant="body2">
                    {order.detail?.quantity}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    {order.detail?.amount && order.detail?.quantity
                      ? currencyConverter(
                          order.detail.amount * order.detail.quantity
                        )
                      : "N/A"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    Biaya Admin
                  </Typography>
                  <Typography variant="body2">
                    {currencyConverter(order.feeAmt)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    Diskon
                  </Typography>
                  <Typography variant="body2">
                    {currencyConverter(order.discAmt)}
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currencyConverter(order.totalAmt)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                {(order.cd === "ID_JENIUSPAY" || order.cd === "ID_OVO") &&
                  order.status === OrderStatuses.PENDING_PAYMENT && (
                    <Box sx={{ marginBottom: 4 }}>
                      <Alert severity="info">
                        Silahkan cek aplikasi{" "}
                        {order.cd === "ID_OVO" ? "OVO" : "JENIUS"} mu untuk
                        melanjutkan pembayaran
                      </Alert>
                    </Box>
                  )}

                <Box sx={{ marginBottom: 4 }}>
                  {
                    getStatusPayment(
                      order.status as OrderStatuses,
                      order.type as OrderType,
                      order.expiredAt as string
                    ).alert
                  }
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Pembayaran
                  </Typography>
                </Box>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Status
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Nomor Invoice
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tanggal Order
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Metode Pembayaran
                      </Typography>
                    </Box>
                    {order.cd === "ID_OVO" && (
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Nomor OVO
                        </Typography>
                      </Box>
                    )}
                    {order.cd === "ID_JENIUSPAY" && (
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Nomor OVO
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item md={6}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {
                          getStatusPayment(
                            order.status as OrderStatuses,
                            order.type as OrderType,
                            order.expiredAt as string
                          ).box
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {order.invoiceId}
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {dayjs(order.createdAt).format("DD MMM YYYY HH:mm:ss")}
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {order.paymentMethods?.name}
                      </Typography>
                    </Box>
                    {order.cd === "ID_OVO" && (
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.payment?.mobileNumber.replace("+62", "0")}
                        </Typography>
                      </Box>
                    )}
                    {order.cd === "ID_JENIUSPAY" && (
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.cashtag}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {!(order.cd === "ID_JENIUSPAY" || order.cd === "ID_OVO") &&
              order.status === OrderStatuses.PENDING_PAYMENT && (
                <Card sx={{ marginTop: 4 }}>
                  <CardContent>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography>
                          {getTitlePayment(order.category)}
                        </Typography>
                        <Box>
                          <Avatar
                            title="Logo Gasskeun Topup"
                            src={order.paymentMethods?.logo}
                            variant="rounded"
                            sx={{
                              width: 100,

                              img: {
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      {(order.category === PaymentsCategory.QRIS ||
                        order.cd === "ID_SHOPEEPAY") && (
                        <Box sx={{ marginTop: 4 }}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              mr: 3,
                              width: "auto",
                              height: "auto",
                              boxShadow: 3,
                              color: "common.white",
                              backgroundColor: `white`,
                            }}
                          >
                            <Canvas
                              text={
                                order.payment.qrString ||
                                order.payment.qrCheckoutString
                              }
                              options={{
                                errorCorrectionLevel: "M",
                                margin: 3,
                                scale: 4,
                                width: 300,
                                quality: 1,
                              }}
                              logo={{
                                src: logoGasskeun as string,
                                options: {
                                  width: 50,
                                },
                              }}
                            />
                          </Avatar>
                        </Box>
                      )}
                      {order.category === PaymentsCategory.EWALLET &&
                        !(
                          order.cd === "ID_JENIUSPAY" || order.cd === "ID_OVO"
                        ) &&
                        order.status === OrderStatuses.PENDING_PAYMENT && (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: 4 }}
                            href={
                              order.payment?.mobileDeeplinkCheckoutUrl ||
                              order.payment?.mobileWebCheckoutUrl ||
                              order.payment?.desktopWebCheckoutUrl ||
                              "#"
                            }
                          >
                            Bayar Disini
                          </Button>
                        )}

                      {(order.category === PaymentsCategory.RETAIL ||
                        order.category ===
                          PaymentsCategory.VIRTUAL_ACCOUNT) && (
                        <ClickAwayListener onClickAway={handleTooltipClose}>
                          <div>
                            <Tooltip
                              PopperProps={{
                                disablePortal: true,
                              }}
                              onClose={handleTooltipClose}
                              open={open}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              title="Berhasil Disalin"
                            >
                              <Button
                                variant="outlined"
                                sx={{ width: "100%", marginTop: 4 }}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    order.payment?.accountNumber ||
                                      order.payment?.paymentCode
                                  );
                                  handleTooltipOpen();
                                }}
                              >
                                {order.payment?.accountNumber ||
                                  order.payment?.paymentCode}
                              </Button>
                            </Tooltip>
                          </div>
                        </ClickAwayListener>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default NewPayment;
