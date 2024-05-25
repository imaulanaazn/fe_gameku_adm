import {
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Box,
  Avatar,
  Typography,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { currencyConverter } from "@/@core/utils/currencyConverter";
import dayjs from "dayjs";
import {
  OrderStatuses,
  OrderType,
  PaymentAction,
  PaymentsCategory,
} from "@/enum";
import { useQRCode } from "next-qrcode";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const getStatusPayment = (status: OrderStatuses, expiredAt: string) => {
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

const getTitlePayment = (paymentAction: string): string => {
  let str: string;
  switch (paymentAction) {
    case PaymentAction.PAYMENT_CODE:
      str = "Kode Pembayaran";
      break;
    case PaymentAction.QR_STRING:
      str = "Scan QR untuk bayar";
    case PaymentAction.CHECKOUT_URL:
      str = "Klik URL berikut untuk melanjutkan";
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
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle navigation based on payment status
    if (
      invoices.order.status === OrderStatuses.SUCCESS ||
      order?.order.status === OrderStatuses.SUCCESS
    ) {
      router.push(`/payment-success/${invoices.order.invoiceId}`);
    }
  }, [
    invoices.order.status,
    order?.order.status,
    invoices.order.invoiceId,
    router,
  ]);

  const handleTooltip = (bool: boolean) => {
    setOpen(bool);
  };

  const onQRDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.getElementsByTagName("canvas")[0];
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "qr-code.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  useEffect(() => {
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
    getLogo();
  }, []);

  useEffect(() => {
    const getOrder = async (fromInterval: boolean) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/order-detail/${invoices.order.invoiceId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
        );

        const res = await req.json();
        setOrder(res);

        // Stop interval if needed
        if (
          fromInterval &&
          ["3", "4", "5", "6"].includes(order?.order.status || "")
        ) {
          setIsFinished(true);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    const interval = setInterval(async () => {
      if (!isFinished) {
        await getOrder(true);
      }
    }, 5000);

    // Clean up interval
    return () => clearInterval(interval);
  }, [order?.order.status, isFinished, invoices.order.invoiceId]);

  return (
    <Grid container spacing={6}>
      {order && (
        <>
          <Grid item xs={12} md={7}>
            <Stack spacing={6}>
              {/* INFORMASI PRODUCT CARD */}
              <Paper
                sx={{ position: "relative", padding: 6, borderRadius: 2 }}
                elevation={0}
              >
                <Box
                  sx={{
                    marginBottom: 4,
                    backgroundColor: "#FFE4E5",
                    padding: 4,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#B72025" }}
                  >
                    Informasi Produk
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <Avatar
                      src={order.game.logoUrl}
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
                        {order.product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.25px",
                          fontWeight: 600,
                          marginTop: 1.5,
                        }}
                      >
                        {order.game.name}
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
                      {currencyConverter(order.order.totalAmt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                  {(order.order?.userId ||
                    order.order?.serverId ||
                    order.order?.username) && (
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#374151" }}
                    >
                      Data game :
                    </Typography>
                  )}
                </Box>

                <Box>
                  {order?.order?.userId && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, marginTop: 2 }}
                      >
                        User ID
                      </Typography>
                      {order?.order?.userId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, marginTop: 2 }}
                        >
                          {order?.order?.userId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {order?.order?.serverId && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, marginTop: 2 }}
                      >
                        Server ID
                      </Typography>
                      {order?.order?.serverId && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, marginTop: 2 }}
                        >
                          {order?.order?.serverId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {order?.order?.username && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, marginTop: 2 }}
                      >
                        Username
                      </Typography>
                      {order?.order?.username && (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, marginTop: 2 }}
                        >
                          {order?.order?.username}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
              </Paper>

              {/* INFROMASI PESANAN CARD */}
              <Paper
                sx={{ position: "relative", padding: 6, borderRadius: 2 }}
                elevation={0}
              >
                <Box
                  sx={{
                    marginBottom: 4,
                    backgroundColor: "#FFE4E5",
                    padding: 4,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#B72025" }}
                  >
                    Informasi Pesanan
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
                    {order.product.name}
                  </Typography>
                  <Typography variant="body2">
                    {currencyConverter(order.order ? order.order.amount : 0)}
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
                    {order.order?.quantity}
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
                    {order.order?.amount && order.order?.quantity
                      ? currencyConverter(
                          order.order.amount * order.order.quantity
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
                    {currencyConverter(order.order.feeAmt)}
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
                    {currencyConverter(order.order.discAmt)}
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
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    {currencyConverter(order.order.totalAmt)}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={6}>
              <Paper
                sx={{ position: "relative", padding: 6, borderRadius: 2 }}
                elevation={0}
              >
                <Box
                  sx={{
                    marginBottom: 4,
                    backgroundColor: "#FFE4E5",
                    padding: 4,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#B72025" }}
                  >
                    Informasi Pembayaran
                  </Typography>
                </Box>
                {(order.payment.cd === "ID_JENIUSPAY" ||
                  order.payment.cd === "ID_OVO") &&
                  order.order.status === OrderStatuses.PENDING_PAYMENT && (
                    <Box sx={{ marginBottom: 4 }}>
                      <Alert severity="info">
                        Silahkan cek aplikasi{" "}
                        {order.payment.cd === "ID_OVO" ? "OVO" : "JENIUS"} mu
                        untuk melanjutkan pembayaran
                      </Alert>
                    </Box>
                  )}

                <Box sx={{ marginBottom: 4 }}>
                  {
                    getStatusPayment(
                      order.order.status as OrderStatuses,
                      order.payment.expiredAt as string
                    ).alert
                  }
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Status
                    </Typography>
                    <Typography noWrap variant="body2" sx={{ fontWeight: 500 }}>
                      {
                        getStatusPayment(
                          order.order.status as OrderStatuses,

                          order.payment.expiredAt as string
                        ).box
                      }
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Nomor Invoice
                    </Typography>
                    <Typography noWrap variant="body2" sx={{ fontWeight: 500 }}>
                      {order.order.invoiceId}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Tanggal Order
                    </Typography>
                    <Typography noWrap variant="body2" sx={{ fontWeight: 500 }}>
                      {dayjs(order.order.createdAt).format(
                        "DD MMM YYYY HH:mm:ss"
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Metode Pembayaran
                    </Typography>
                    <Typography noWrap variant="body2" sx={{ fontWeight: 500 }}>
                      {order.payment.name}
                    </Typography>
                  </Stack>
                  {order.payment.cd === "ID_OVO" && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Nomor OVO
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {"mobileNumber" in order.payment.action &&
                          order.payment.action.mobileNumber.replace("+62", "0")}
                      </Typography>
                    </Stack>
                  )}

                  {order.payment.cd === "ID_JENIUSPAY" && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Nomor OVO
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {"cashtag" in order.payment.action &&
                          order.payment.action.cashtag}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Paper>

              {!(
                order.payment.cd === "ID_JENIUSPAY" ||
                order.payment.cd === "ID_OVO"
              ) &&
                order.order.status === OrderStatuses.PENDING_PAYMENT && (
                  <Paper
                    sx={{ position: "relative", padding: 6, borderRadius: 2 }}
                    elevation={0}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ color: "#374151", fontWeight: 600 }}>
                          {getTitlePayment(
                            Object.keys(order.payment.action)[0]
                          )}
                        </Typography>
                        <Box>
                          <Avatar
                            title="Logo Gasskeun Topup"
                            src={order.payment?.logo}
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

                      {PaymentAction.QR_STRING in order.payment.action && (
                        <Box sx={{ marginTop: 4, textAlign: "center" }}>
                          <div ref={canvasRef}>
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
                                text={order.payment.action.qrString}
                                options={{
                                  errorCorrectionLevel: "M",
                                  margin: 3,
                                  scale: 4,
                                  width: 300,
                                  quality: 1,
                                }}
                                // logo={{
                                //   src: logoGasskeun as string,
                                //   options: {
                                //     width: 50,
                                //   },
                                // }}
                              />
                            </Avatar>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginTop: 4 }}
                              onClick={onQRDownload}
                            >
                              Download QR Code
                            </Button>
                          </div>
                        </Box>
                      )}

                      {PaymentAction.CHECKOUT_URL in order.payment.action &&
                        order.order.status ===
                          OrderStatuses.PENDING_PAYMENT && (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: 4 }}
                            href={
                              (PaymentAction.CHECKOUT_URL in
                                order.payment.action &&
                                order.payment.action.checkoutUrl) ||
                              "#"
                            }
                          >
                            Lanjutkan Pembayaran
                          </Button>
                        )}

                      {PaymentAction.PAYMENT_CODE in order.payment.action && (
                        <ClickAwayListener
                          onClickAway={() => {
                            handleTooltip(false);
                          }}
                        >
                          <div>
                            <Tooltip
                              PopperProps={{
                                disablePortal: true,
                              }}
                              onClose={() => {
                                handleTooltip(false);
                              }}
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
                                    PaymentAction.PAYMENT_CODE in
                                      order.payment.action
                                      ? order.payment?.action.paymentCode
                                      : ""
                                  );
                                  handleTooltip(true);
                                }}
                              >
                                {PaymentAction.PAYMENT_CODE in
                                order.payment.action
                                  ? order.payment?.action.paymentCode
                                  : ""}
                              </Button>
                            </Tooltip>
                          </div>
                        </ClickAwayListener>
                      )}
                    </Box>
                  </Paper>
                )}
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default NewPayment;
