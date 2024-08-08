import { currencyConverter } from "@/lib/currencyConverter";
import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CheckDecagram, Close, CloseCircle } from "mdi-material-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,

  "@media (min-width: 720px)": {
    width: 600,
  },
};

interface ConfirmCheckout {
  isOpen: boolean;
  onClose: () => void;
  dataCheckout: any;
  balance: number;
}

const ConfirmCheckout = ({
  isOpen,
  onClose,
  dataCheckout,
  balance,
}: ConfirmCheckout) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [msg, setMsg] = useState("Sedang membuat order");
  const [desc, setDesc] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const amt = parseInt(dataCheckout.amount) * parseInt(dataCheckout.quantity);
  const fee = dataCheckout.feeAmount;
  const disc = dataCheckout.promoAmount;
  const totalCheckout = amt + fee - disc;
  const { labelGameData } = getTitleByGamesCategory(dataCheckout.products);

  const requestCheckout = async () => {
    setStep(2);
    setWaiting(true);
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v3/order", {
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      method: "POST",
      body: JSON.stringify({
        userId: dataCheckout.userId,
        serverId: dataCheckout.serverId,
        productId: dataCheckout.productId,
        quantity: parseInt(dataCheckout.quantity),
        paymentId: dataCheckout.paymentMethodId,
        promoCode: dataCheckout.promoCode,
        mobileNumber: dataCheckout.mobileNumber,
        cashtag: dataCheckout.cashtag,
      }),
    });

    const res = await req.json();
    if (req.ok) {
      setMsg(
        dataCheckout.paymentMethod.cd === "GASSKEUN"
          ? "Orderan berhasil dibayar"
          : "Order Berhasil dibuat"
      );
      setIsSuccess(true);
      setWaiting(false);
      router.push("/payment/" + res.invoice);
    } else {
      setMsg("Order Gagal dibuat");
      setIsSuccess(false);
      toast.error(res.message || res.errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setWaiting(false);
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 500);
    }
  };

  const handleCheckout = () => {
    requestCheckout();
  };

  const getIcon = () => {
    if (waiting) {
      return <CircularProgress />;
    } else if (!waiting && isSuccess) {
      return (
        <CheckDecagram
          sx={{
            width: 40,
            height: 40,
            color: "green",
          }}
        />
      );
    } else if (!waiting && !isSuccess) {
      return (
        <CloseCircle
          sx={{
            width: 40,
            height: 40,
            color: "darkred",
          }}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        if (step > 1) {
          setStep(1);
        }
      }}
    >
      <Card sx={style}>
        {step === 1 ? (
          <>
            <CardHeader
              title="Data Checkout"
              titleTypographyProps={{
                sx: {
                  lineHeight: "1.2 !important",
                  letterSpacing: "0.31px !important",
                  color: "#1F2937",
                  fontWeight: "800",
                },
              }}
              action={
                <IconButton
                  size="small"
                  aria-label="settings"
                  className="card-more-options"
                  sx={{ color: "text.secondary" }}
                  onClick={() => onClose()}
                >
                  <Close />
                </IconButton>
              }
            />

            <CardContent sx={{ marginTop: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    src={dataCheckout.products.logoUrl}
                    variant="rounded"
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {dataCheckout.product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {dataCheckout.products.name}
                    </Typography>
                  </Box>
                </Box>
                <Typography>
                  {currencyConverter(dataCheckout.product.price)}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 6 }} />
              {dataCheckout.userId && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">{labelGameData}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {dataCheckout.userId}
                  </Typography>
                </Box>
              )}
              {dataCheckout.serverId && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Server ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {dataCheckout.serverId}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {currencyConverter(dataCheckout.product.price)}
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
                <Typography variant="body2">Jumlah Pembelian</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {dataCheckout.quantity}
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
                <Typography variant="body2">Biaya Admin</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {currencyConverter(dataCheckout.feeAmount)}
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
                <Typography variant="body2">Diskon</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {currencyConverter(dataCheckout.promoAmount)}
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
                <Typography variant="body2">Kode Promo</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {dataCheckout.promo.code || "---"}
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
                <Typography variant="body2">Metode Pembayaran</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {dataCheckout.paymentMethod.name}
                </Typography>
              </Box>
              {dataCheckout.paymentMethod.cd === "ID_OVO" ||
                (dataCheckout.paymentMethod.cd === "OVOPUSH" && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">Nomor OVO</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {dataCheckout.mobileNumber}
                    </Typography>
                  </Box>
                ))}
              {dataCheckout.paymentMethod.cd === "ID_JENIUSPAY" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Cashtag</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {dataCheckout.cashtag.startsWith("$")
                      ? dataCheckout.cashtag
                      : `$${dataCheckout.cashtag}`}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ marginY: 6 }} />
              {dataCheckout.paymentMethod.cd === "GASSKEUN" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1">Sisa Saldo</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {currencyConverter(balance)}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {currencyConverter(totalCheckout)}
                </Typography>
              </Box>
              <Button
                id="buyNow"
                fullWidth
                variant="contained"
                sx={{ marginTop: 4 }}
                onClick={() => handleCheckout()}
                disabled={
                  dataCheckout.paymentMethod.cd === "GASSKEUN" &&
                  balance < totalCheckout
                }
              >
                {dataCheckout.paymentMethod.cd === "GASSKEUN"
                  ? "Bayar Sekarang"
                  : "Beli Sekarang"}
              </Button>
            </CardContent>
          </>
        ) : step === 2 ? (
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography>{msg}</Typography>
              <Box sx={{ display: "flex" }}>{getIcon()}</Box>
            </Box>
          </CardContent>
        ) : (
          <></>
        )}
      </Card>
    </Modal>
  );
};

export default ConfirmCheckout;
