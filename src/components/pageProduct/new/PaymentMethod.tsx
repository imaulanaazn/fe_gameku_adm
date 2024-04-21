import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

  const categoryTabs = Object.keys(groupedPaymentMethods).map(
    (category, index) => <Tab key={category} label={accordionTitle(category)} />
  );

  const tabPanels = Object.entries(groupedPaymentMethods).map(
    ([category, methods], index) => (
      <TabPanel value={selectedTab} index={index} key={category}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {methods.map((method) => (
            <Box
              key={method.id}
              onClick={() => {
                if (
                  value.totalAmountBeforeFee &&
                  value.totalAmountBeforeFee > method.minAmount &&
                  value.totalAmountBeforeFee < method.maxAmount
                ) {
                  onChange("paymentMethodId", method.id);
                  onChange(
                    "feeAmount",
                    method.feeType === FeeType.PERCENTAGE
                      ? (value.totalAmountBeforeFee * method.fee) / 100
                      : method.fee
                  );
                  onChange("paymentMethodCd", method.cd);
                  onChange("paymentMethod", method);
                  onChange("promoCode", "");
                  onChange("promo", "");
                }
              }}
              sx={{
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: "0.4rem",
                flexWrap: "wrap",
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
              <Avatar
                title="Logo Gasskeun Topup"
                src={method.logo}
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50,
                  img: { width: "100%", height: "100%", objectFit: "contain" },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#1F2937",
                  ...(method.id === value.paymentMethodId && {
                    fontWeight: "600",
                  }),
                }}
              >
                {!value.totalAmountBeforeFee ||
                value.totalAmountBeforeFee > method.maxAmount ||
                value.totalAmountBeforeFee < method.minAmount
                  ? `Tidak memenuhi syarat (${
                      value.totalAmountBeforeFee < method.minAmount
                        ? "MIN " + currencyConverter(method.minAmount)
                        : "MAX " + currencyConverter(method.maxAmount)
                    })`
                  : currencyConverter(
                      value.totalAmountBeforeFee +
                        (method.feeType === FeeType.PERCENTAGE
                          ? (value.totalAmountBeforeFee * method.fee) / 100
                          : method.fee)
                    )}
              </Typography>
            </Box>
          ))}
        </Box>
      </TabPanel>
    )
  );

  return (
    <Card
      sx={{
        marginTop: position > 1 ? 4 : 0,
        borderRadius: "0.75rem",
        background:
          "#ffffff url(/images/topup-form-step-4.svg) no-repeat right top",
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
            sx={{
              "& .MuiTabs-flexContainer": {
                maxWidth: "100%",
                overflowX: "auto",
              },
            }}
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
