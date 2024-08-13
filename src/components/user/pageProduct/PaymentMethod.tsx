import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Link,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import React from "react";
import { FeeType, PaymentsCategory } from "@/enum";
import { currencyConverter } from "@/lib/currencyConverter";
import Image from "next/image";

const PaymentMethod = ({ value, data, onChange, position }: any) => {
  const sortedData = data.sort((a: any, b: any) =>
    a.category > b.category ? 1 : b.category > a.category ? -1 : 0
  );

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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {sortedData.map((method: any) => (
            <Link
              href="#mobile_number"
              key={method.id}
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
              }}
            >
              <Box
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
                      Math.ceil(
                        (value.totalAmountBeforeFee + feeAmount) / 1000
                      ) *
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
                  width: "100%",

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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
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
                          method.providerCd === "TOKOPAY" &&
                            method.category === "6"
                            ? Math.ceil(
                                (value.totalAmountBeforeFee +
                                  (method.feeType === FeeType.PERCENTAGE
                                    ? (value.totalAmountBeforeFee *
                                        method.fee) /
                                      100
                                    : method.fee)) /
                                  1000
                              ) * 1000
                            : value.totalAmountBeforeFee +
                                (method.feeType === FeeType.PERCENTAGE
                                  ? (value.totalAmountBeforeFee * method.fee) /
                                    100
                                  : method.fee)
                        )}
                  </Typography>
                </Box>

                <Divider />

                <Typography fontSize={11}>{method.name}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
