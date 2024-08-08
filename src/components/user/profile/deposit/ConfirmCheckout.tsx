import { currencyConverter } from "@/lib/currencyConverter";
import {
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
}

const ConfirmCheckout = ({
  isOpen,
  onClose,
  dataCheckout,
}: ConfirmCheckout) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [msg, setMsg] = useState("Sedang membuat order");
  const [isSuccess, setIsSuccess] = useState(false);
  const amt = parseInt(dataCheckout.amount);
  const fee = dataCheckout.feeAmount;
  const totalCheckout = amt + fee;

  const requestCheckout = async () => {
    setStep(2);

    setWaiting(true);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/user/topup",
      {
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        method: "POST",
        body: JSON.stringify({
          amount: amt,
          paymentMethodId: dataCheckout.paymentMethodId,
          mobileNumber: dataCheckout.mobileNumber,
          cashtag: dataCheckout.cashtag,
        }),
      }
    );

    const res = await req.json();
    if (req.ok) {
      setMsg("Pesanan Deposit Berhasil Dibuat");
      setIsSuccess(true);
      setWaiting(false);
      router.push("/payment/" + res.invoiceId);
    } else {
      setMsg("Pesanan Deposit Gagal dibuat");
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
              title="Data Deposit"
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
              <Divider sx={{ marginY: 6 }} />

              {/* <Box
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
                </Box> */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Jumlah Deposit</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {currencyConverter(dataCheckout.amount)}
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: "0.4rem",
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
                  marginTop: "0.4rem",
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
                      marginTop: "0.4rem",
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
              >
                Bayar Sekarang
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
