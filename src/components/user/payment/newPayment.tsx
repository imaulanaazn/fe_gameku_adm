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
  Chip,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import PaymentInstructionModal from "./PaymentInstructionModal";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

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
    box: <Chip label={msgBox} color={severity as any} variant="outlined" />,
  };
};

const getTitlePayment = (paymentActions: any): string => {
  let paymentAction = "";
  for (const property in paymentActions) {
    if (
      property === "checkoutUrl" ||
      property === "qrString" ||
      property === "paymentCode"
    ) {
      if (paymentActions[property]) {
        paymentAction = property;
      }
    }
  }

  let str: string;
  switch (paymentAction) {
    case PaymentAction.PAYMENT_CODE:
      str = "Kode Pembayaran";
      break;
    case PaymentAction.QR_STRING:
      str = "Scan QR untuk bayar";
      break;
    case PaymentAction.CHECKOUT_URL:
      str = "Tekan tombol lanjutkan";
      break;
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
  const [openModal, setOpenModal] = React.useState(false);

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
    <>
      <PaymentInstructionModal
        setOpen={() => setOpenModal(false)}
        open={openModal}
        paymentName={invoices.payment.name}
        paymentGuide={invoices.payment.paymentGuide}
      />

      {order?.order.status === OrderStatuses.PENDING_PAYMENT && (
        <Box display={{ xs: "none", sm: "block" }}>
          <PaymentPendingCountdown
            expiredAt={order?.payment.expiredAt}
            createdAt={order?.order.createdAt}
          />
        </Box>
      )}

      <Grid
        container
        spacing={6}
        mt={1}
        flexDirection={{ xs: "column-reverse", md: "row" }}
      >
        {order && (
          <>
            <Grid item xs={12} md={7}>
              <Stack spacing={6}>
                {/* INFORMASI PRODUCT CARD */}
                <Paper
                  sx={{
                    position: "relative",
                    padding: 6,
                    borderRadius: 2,
                    backgroundColor: "#161721",
                  }}
                  elevation={0}
                >
                  <Box
                    sx={{
                      marginBottom: 4,
                      backgroundColor: "#fb923c21",
                      padding: 4,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#fb923ce6" }}
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
                            color: "#ffffff",
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
                            color: "#ffffff",
                          }}
                        >
                          {order.game.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#ffffff",
                          marginTop: 1.5,
                        }}
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          marginTop: 1.5,
                          color: "#ffffff",
                        }}
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
                        sx={{ fontWeight: 600, color: "#ffffff" }}
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
                          sx={{
                            fontWeight: 500,
                            marginTop: 2,
                            color: "#d1d5db",
                          }}
                        >
                          User ID
                        </Typography>
                        {order?.order?.userId && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              marginTop: 2,
                              color: "#d1d5db",
                            }}
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
                  sx={{
                    position: "relative",
                    padding: 6,
                    borderRadius: 2,
                    backgroundColor: "#161721",
                  }}
                  elevation={0}
                >
                  <Box
                    sx={{
                      marginBottom: 4,
                      backgroundColor: "#fb923c21",
                      padding: 4,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#fb923ce6" }}
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#ffffff" }}
                    >
                      {order.product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
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
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                      Kuantitas
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 400, color: "#d1d5db" }}
                    >
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 400, color: "#d1d5db" }}
                    >
                      Biaya Admin
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 400, color: "#d1d5db" }}
                    >
                      Diskon
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
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
                      sx={{ fontWeight: 600, color: "#ffffff" }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: "#ffffff",
                        fontSize: "1rem",
                      }}
                    >
                      {currencyConverter(order.order.totalAmt)}
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack
                gap={6}
                flexDirection={{ xs: "column-reverse", md: "column" }}
              >
                <Paper
                  sx={{
                    position: "relative",
                    padding: 6,
                    borderRadius: 2,
                    backgroundColor: "#161721",
                  }}
                  elevation={0}
                >
                  <Box
                    sx={{
                      marginBottom: 4,
                      backgroundColor: "#fb923c21",
                      padding: 4,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#fb923ce6" }}
                    >
                      Informasi Pembayaran
                    </Typography>
                  </Box>
                  {(order.payment.cd === "ID_JENIUSPAY" ||
                    order.payment.cd === "ID_OVO" ||
                    order.payment.cd === "OVOPUSH") &&
                    order.order.status === OrderStatuses.PENDING_PAYMENT && (
                      <Box sx={{ marginBottom: 4 }}>
                        <Alert severity="info">
                          Silahkan cek aplikasi{" "}
                          {order.payment.cd === "ID_OVO" ||
                          order.payment.cd === "OVOPUSH"
                            ? "OVO"
                            : "JENIUS"}{" "}
                          mu untuk melanjutkan pembayaran
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        Status
                      </Typography>
                      {
                        getStatusPayment(
                          order.order.status as OrderStatuses,
                          order.payment.expiredAt as string
                        ).box
                      }
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        Nomor Invoice
                      </Typography>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        {order.order.invoiceId}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        Tanggal Order
                      </Typography>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        Metode Pembayaran
                      </Typography>
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#d1d5db" }}
                      >
                        {order.payment.name}
                      </Typography>
                    </Stack>
                    {(order.payment.cd === "ID_OVO" ||
                      order.payment.cd === "OVOPUSH") && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ marginBottom: 2 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#d1d5db" }}
                        >
                          Nomor OVO
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#d1d5db" }}
                        >
                          {"mobileNumber" in order.payment.action &&
                            order.payment.action.mobileNumber.replace(
                              "+62",
                              "0"
                            )}
                        </Typography>
                      </Stack>
                    )}

                    {order.payment.cd === "ID_JENIUSPAY" && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ marginBottom: 2 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#d1d5db" }}
                        >
                          Cashtag
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#d1d5db" }}
                        >
                          {"cashtag" in order.payment.action &&
                            order.payment.action.cashtag}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Paper>

                {!(
                  order.payment.cd === "ID_JENIUSPAY" ||
                  order.payment.cd === "ID_OVO" ||
                  order.payment.cd === "OVOPUSH"
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
                          <Typography
                            sx={{ color: "#374151", fontWeight: 600 }}
                          >
                            {getTitlePayment(order.payment.action)}
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

                        {PaymentAction.QR_STRING in order.payment.action &&
                          order.payment.action.qrString && (
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
                          order.payment.action.checkoutUrl &&
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

                        {PaymentAction.PAYMENT_CODE in order.payment.action &&
                          order.payment.action.paymentCode && (
                            <>
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
                                    <Box mt={4}>
                                      <Button
                                        variant="outlined"
                                        sx={{
                                          width: "100%",
                                          backgroundColor: "#fb923c21",
                                          display: "flex",
                                          gap: 2,
                                        }}
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            PaymentAction.PAYMENT_CODE in
                                              order.payment.action
                                              ? order.payment?.action
                                                  .paymentCode
                                              : ""
                                          );
                                          handleTooltip(true);
                                        }}
                                      >
                                        {PaymentAction.PAYMENT_CODE in
                                        order.payment.action
                                          ? order.payment?.action.paymentCode
                                          : ""}
                                        <FontAwesomeIcon icon={faCopy} />
                                      </Button>
                                    </Box>
                                  </Tooltip>
                                </div>
                              </ClickAwayListener>
                            </>
                          )}

                        {order.payment.paymentGuide && (
                          <Stack alignItems={"flex-end"} mt={2}>
                            <Button
                              onClick={() => setOpenModal(true)}
                              size="small"
                              sx={{
                                color: "primary.main",
                                borderRadius: 10,
                              }}
                            >
                              Cara Membayar ?
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    </Paper>
                  )}

                {order.order.status === OrderStatuses.PENDING_PAYMENT && (
                  <Box display={{ xs: "block", sm: "none" }}>
                    <PaymentPendingCountdown
                      expiredAt={order.payment.expiredAt}
                      createdAt={order.order.createdAt}
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

function PaymentPendingCountdown({
  expiredAt,
  createdAt,
}: {
  expiredAt: string;
  createdAt: string;
}) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const expired = new Date(expiredAt).getTime();
      const now = new Date().getTime();
      const distance = expired - now;

      if (distance < 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [expiredAt]);

  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={4}
      sx={{
        padding: 4,
        borderRadius: { xs: 1, md: 2 },
        backgroundColor: "rgb(255 237 213)",
      }}
    >
      <Box
        borderRadius={10}
        sx={{
          backgroundColor: "rgb(253 186 116)",
          display: "flex",
          flexShrink: "0",
          alignItems: "center",
          justifyContent: "center",
        }}
        width={50}
        height={50}
      >
        <FontAwesomeIcon
          icon={faMoneyBill1Wave}
          className="text-white text-2xl"
        />
      </Box>
      <Box>
        <Typography
          fontWeight={600}
          fontSize={{ xs: 14, lg: 16 }}
          color={"#374151"}
        >
          Gass Selesaikan Transaksimu!!
        </Typography>
        <Typography fontSize={{ xs: 14, lg: 16 }} color={"gray.900"}>
          Waktu Tersisa{"  "}
          <Typography
            variant="caption"
            sx={{ color: "#fb923ce6", fontWeight: 600, fontSize: "inherit" }}
          >
            {" "}
            {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}
            m {timeRemaining.seconds}s{" "}
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
}

export default NewPayment;
