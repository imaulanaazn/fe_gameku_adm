"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Modal,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import { FeeType, PaymentsCategory } from "@/enum";
import { currencyConverter } from "@/lib/currencyConverter";
import { CheckDecagram, Close, CloseCircle } from "mdi-material-ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Alert } from "@mui/lab";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Deposit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    paymentMethodId: "",
    paymentMethodCd: "",
    mobileNumber: "",
    cashtag: "",
    feeAmount: 0,
    totalAmount: 0,
    amount: 0,
    paymentMethod: "" as any,
  });

  const [paymentsMethod, setPaymentsMethods] = useState<IPaymentMethod[]>([]);

  const handleChange = (key: keyof typeof data, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  function handleInputChange(e: { target: { value: string } }) {
    const numericValue = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (!isNaN(numericValue)) {
      handleChange("amount", numericValue);
    } else {
      handleChange("amount", "");
    }
  }

  useEffect(() => {
    async function getPaymentsMethods() {
      try {
        const response = await fetch(
          `${BASE_URL}/v1/payments-method?query=9&type=deposit`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("failed to fetch payment method");
        }

        const result = await response.json();

        setPaymentsMethods(result);
      } catch (error) {
        console.error(error);
      }
    }

    getPaymentsMethods();
  }, []);

  useEffect(() => {
    if (
      !data.paymentMethodId ||
      (data.paymentMethod.cd === "ID_JENIUSPAY" && !data.cashtag) ||
      (data.paymentMethod.cd === "OVOPUSH" && !data.mobileNumber)
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    data.paymentMethodId,
    data.mobileNumber,
    data.cashtag,
    data.paymentMethod.cd,
  ]);

  return (
    <div>
      <Card
        sx={{
          borderRadius: "0.75rem",
          background: `#ffffff url(/images/topup-form-step-1.svg) no-repeat right top`,
          backgroundSize: "150px",
        }}
      >
        <CardHeader
          title="Jumlah Deposit"
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
              color: "#1F2937",
            },
          }}
        />
        <CardContent
          sx={{
            pt: (theme) => `${theme.spacing(3)} !important`,
            display: "flex",
            gap: "1rem",
            paddingX: "1.25rem",
          }}
        >
          <TextField
            value={currencyConverter(data.amount)}
            fullWidth
            id="total"
            label="Jumlah Deposit"
            sx={{
              "& .MuiFormLabel-root": { color: "#B72025" },
              "& input": {
                border: "1px solid #B72025",
                borderRadius: "0.4rem",
              },
              "& .MuiInputLabel-root": {
                background: "white",
              },
            }}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>
      <PaymentMethod
        value={data}
        data={paymentsMethod}
        onChange={(key: any, value: any) => handleChange(key, value)}
      />
      {data.paymentMethod.cd === "OVOPUSH" && (
        <MobileNumber
          value={data}
          onChange={(key: any, value: any) => handleChange(key, value)}
        />
      )}
      <AdditionalData
        value={data}
        onChange={(key: any, value: any) => handleChange(key, value)}
      />
      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ marginTop: 4 }}
        onClick={() => setModalOpen(true)}
        disabled={isDisabled}
      >
        Deposit Sekarang
      </Button>
      <ConfirmCheckout
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dataCheckout={{
          ...data,
        }}
      />
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  [key: string]: any;
}

const accordionTitle = (category: string) => {
  let title;
  switch (category) {
    case PaymentsCategory.EWALLET:
    case PaymentsCategory.QRIS:
    case "1_2":
      title = "Ewallet dan QRIS";
      break;
    case PaymentsCategory.RETAIL:
      title = "Retail";
      break;
    case PaymentsCategory.INTERNAL:
      title = "Internal";
      break;
    case PaymentsCategory.PULSA:
      title = "Pulsa";
      break;
    case PaymentsCategory.VIRTUAL_ACCOUNT:
      title = "Virtual Account";
      break;
    default:
      title = "Saldo Gasskeun";
      break;
  }

  return title;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingX: 0, paddingY: "1rem" }}>{children}</Box>
      )}
    </div>
  );
}

const PaymentMethod = ({ value, data, onChange }: any) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const groupedPaymentMethods: { [category: string]: Array<IPaymentMethod> } =
    {};

  data.forEach((method: IPaymentMethod) => {
    const unifiedCategory =
      method.category === "1" || method.category === "2"
        ? "1_2"
        : method.category;

    if (!groupedPaymentMethods[unifiedCategory]) {
      groupedPaymentMethods[unifiedCategory] = [];
    }

    groupedPaymentMethods[unifiedCategory].push(method);
  });

  const categoryTabs = Object.keys(groupedPaymentMethods)
    .sort()
    .map((category, index) => {
      return <Tab key={category} label={accordionTitle(category)} />;
    });

  const tabPanels = Object.entries(groupedPaymentMethods)
    .sort()
    .map(([category, methods], index) => (
      <TabPanel value={selectedTab} index={index} key={category}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {methods.map((method) => (
            <Box
              key={method.id}
              onClick={() => {
                let feeAmount;

                if (
                  method.providerCd === "TOKOPAY" &&
                  method.category === "6"
                ) {
                  feeAmount =
                    method.feeType === FeeType.PERCENTAGE
                      ? (value.amount * method.fee) / 100
                      : method.fee;
                  feeAmount =
                    Math.ceil((value.amount + feeAmount) / 1000) * 1000 -
                    value.amount;
                } else {
                  feeAmount =
                    method.feeType === FeeType.PERCENTAGE
                      ? (value.amount * method.fee) / 100
                      : method.fee;
                }

                if (
                  value.amount &&
                  value.amount > method.minAmount &&
                  value.amount < method.maxAmount
                ) {
                  onChange("paymentMethodId", method.id);
                  onChange("feeAmount", feeAmount);
                  onChange("paymentMethodCd", method.cd);
                  onChange("paymentMethod", method);
                  onChange("promoCode", "");
                  onChange("promo", "");
                }
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm:
                    !value.amount ||
                    value.amount > method.maxAmount ||
                    value.amount < method.minAmount
                      ? "48%"
                      : "48%",
                  lg:
                    !value.amount ||
                    value.amount > method.maxAmount ||
                    value.amount < method.minAmount
                      ? "31%"
                      : "31%",
                },
                display: "flex",
                justifyContent: { xs: "center", md: "space-between" },
                alignItems: "center",
                gap: 2,
                padding: 4,
                borderRadius: "0.4rem",
                border: "1px solid #B72025",
                ...(method.id === value.paymentMethodId && {
                  outline: "2px solid #B72025",
                  backgroundColor: "#FFE4E5",
                }),
                ...(value.amount &&
                value.amount > method.minAmount &&
                value.amount < method.maxAmount
                  ? { cursor: "pointer" }
                  : { filter: "grayscale(100%)", cursor: "not-allowed" }),
              }}
            >
              <Box position={"relative"} width={70} height={40}>
                <Image
                  src={method.logo}
                  alt="Logo payment method"
                  fill={true}
                  quality={55}
                  objectFit="contain"
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#1F2937",
                  ...(method.id === value.paymentMethodId && {
                    fontWeight: "700",
                  }),
                  textAlign: "right",
                  maxWidth: "55%",
                  ...(value.amount ||
                  value.amount > method.maxAmount ||
                  value.amount < method.minAmount
                    ? {
                        fontWeight: "500",
                      }
                    : {
                        fontWeight: "600",
                      }),
                }}
              >
                {!value.amount ||
                value.amount > method.maxAmount ||
                value.amount < method.minAmount
                  ? ` (${
                      value.amount < method.minAmount
                        ? "Minimal " + currencyConverter(method.minAmount)
                        : "Maximal " + currencyConverter(method.maxAmount)
                    })`
                  : currencyConverter(
                      method.providerCd === "TOKOPAY" && method.category === "6"
                        ? Math.ceil(
                            (value.amount +
                              (method.feeType === FeeType.PERCENTAGE
                                ? (value.amount * method.fee) / 100
                                : method.fee)) /
                              1000
                          ) * 1000
                        : value.amount +
                            (method.feeType === FeeType.PERCENTAGE
                              ? (value.amount * method.fee) / 100
                              : method.fee)
                    )}
              </Typography>
            </Box>
          ))}
        </Box>
      </TabPanel>
    ));

  return (
    <Card
      sx={{
        borderRadius: "0.75rem",
        background: `#ffffff url(/images/topup-form-step-2.svg) no-repeat right top`,
        backgroundSize: "150px",
      }}
    >
      <CardHeader
        title="Metode Pembayaran"
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "#1F2937",
            fontWeight: "800",
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="payment methods tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {categoryTabs}
          </Tabs>
        </Box>
        {tabPanels}
      </CardContent>
    </Card>
  );
};

const MobileNumber = ({ value, onChange }: any) => {
  return (
    <Card
      sx={{
        borderRadius: "0.75rem",
        background: `#ffffff url(/images/topup-form-step-3.svg) no-repeat right top`,
        backgroundSize: "150px",
      }}
    >
      <CardHeader
        title="Nomor OVO"
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "#1F2937",
            fontWeight: "800",
          },
        }}
        // subheader={
        //   value.paymentMethodCd === "ID_OVO" ||
        //   value.paymentMethodCd === "OVOPUSH" ? (
        //     <Alert severity="info">
        //       Pastikan nomor whatsapp sama dengan nomor OVO!
        //     </Alert>
        //   ) : (
        //     <></>
        //   )
        // }
      />
      <CardContent
        sx={{
          pt: (theme) => `${theme.spacing(3)} !important`,
          paddingX: "1.25rem",
        }}
      >
        <TextField
          value={value.mobileNumber}
          fullWidth
          id="mobileNumber"
          label="Nomor OVO"
          sx={{
            "& .MuiFormLabel-root": { color: "#B72025" },
            "& input": {
              border: "1px solid #B72025",
              borderRadius: "0.4rem",
            },
            "& .MuiInputLabel-root": {
              background: "white",
            },
          }}
          onChange={(e) =>
            onChange("mobileNumber", e.target.value.replace(/\D/, ""))
          }
        />
      </CardContent>
    </Card>
  );
};

// import { currencyConverter } from "@/lib/currencyConverter";
// import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CircularProgress,
//   Divider,
//   IconButton,
//   Modal,
//   Typography,
// } from "@mui/material";
// import { CheckDecagram, Close, CloseCircle } from "mdi-material-ui";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";

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

const AdditionalData = ({ data, value, onChange }: any) => {
  if (value.paymentMethodCd === "ID_JENIUSPAY") {
    return (
      <Card
        sx={{
          background: `#ffffff url(/images/topup-form-step-3.svg) no-repeat right top`,
        }}
      >
        <CardHeader
          title="Cashtag"
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
              color: "#1F2937",
              fontWeight: "800",
            },
          }}
        />
        <CardContent
          sx={{
            pt: (theme) => `${theme.spacing(3)} !important`,
            paddingX: "1.25rem",
          }}
        >
          <TextField
            value={value.cashtag}
            autoFocus
            fullWidth
            id="cashtag"
            label="Cashtag"
            sx={{
              marginBottom: 2.5,
              "& .MuiFormLabel-root": { color: "#B72025" },
              "& input": {
                border: "1px solid #B72025",
                borderRadius: "0.4rem",
              },
              "& .MuiInputLabel-root": {
                background: "white",
              },
            }}
            onChange={(e) => onChange("cashtag", e.target.value)}
          />
        </CardContent>
      </Card>
    );
  } else {
    return <></>;
  }
};
