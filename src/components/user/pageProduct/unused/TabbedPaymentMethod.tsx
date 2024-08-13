import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import React from "react";
import { FeeType, PaymentsCategory } from "@/enum";
import { currencyConverter } from "@/lib/currencyConverter";
import Image from "next/image";

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

const PaymentMethod = ({ value, data, onChange, position }: any) => {
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
                      ? (value.totalAmountBeforeFee * method.fee) / 100
                      : method.fee;
                  feeAmount =
                    Math.ceil((value.totalAmountBeforeFee + feeAmount) / 1000) *
                      1000 -
                    value.totalAmountBeforeFee;
                } else {
                  feeAmount =
                    method.feeType === FeeType.PERCENTAGE
                      ? (value.totalAmountBeforeFee * method.fee) / 100
                      : method.fee;
                }

                if (
                  value.totalAmountBeforeFee &&
                  value.totalAmountBeforeFee > method.minAmount &&
                  value.totalAmountBeforeFee < method.maxAmount
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
                    !value.totalAmountBeforeFee ||
                    value.totalAmountBeforeFee > method.maxAmount ||
                    value.totalAmountBeforeFee < method.minAmount
                      ? "48%"
                      : "48%",
                  lg:
                    !value.totalAmountBeforeFee ||
                    value.totalAmountBeforeFee > method.maxAmount ||
                    value.totalAmountBeforeFee < method.minAmount
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
                ...(value.totalAmountBeforeFee &&
                value.totalAmountBeforeFee > method.minAmount &&
                value.totalAmountBeforeFee < method.maxAmount
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
                  loading="lazy"
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
                  ...(value.totalAmountBeforeFee ||
                  value.totalAmountBeforeFee > method.maxAmount ||
                  value.totalAmountBeforeFee < method.minAmount
                    ? {
                        fontWeight: "500",
                      }
                    : {
                        fontWeight: "600",
                      }),
                }}
              >
                {!value.totalAmountBeforeFee ||
                value.totalAmountBeforeFee > method.maxAmount ||
                value.totalAmountBeforeFee < method.minAmount
                  ? ` (${
                      value.totalAmountBeforeFee < method.minAmount
                        ? "Minimal " + currencyConverter(method.minAmount)
                        : "Maximal " + currencyConverter(method.maxAmount)
                    })`
                  : currencyConverter(
                      method.providerCd === "TOKOPAY" && method.category === "6"
                        ? Math.ceil(
                            (value.totalAmountBeforeFee +
                              (method.feeType === FeeType.PERCENTAGE
                                ? (value.totalAmountBeforeFee * method.fee) /
                                  100
                                : method.fee)) /
                              1000
                          ) * 1000
                        : value.totalAmountBeforeFee +
                            (method.feeType === FeeType.PERCENTAGE
                              ? (value.totalAmountBeforeFee * method.fee) / 100
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
        background: `#ffffff url(/images/topup-form-step-${position}.svg) no-repeat right top`,
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

export default PaymentMethod;
