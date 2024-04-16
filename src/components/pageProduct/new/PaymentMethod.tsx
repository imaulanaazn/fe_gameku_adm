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
} from "@mui/material";
import React from "react";
import { FeeType, PaymentsCategory } from "@/enum";
import { currencyConverter } from "@/lib/currencyConverter";

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

const PaymentMethod = ({ value, data, onChange, position }: any) => {
    const groupedPaymentMethods: { [category: string]: Array<IPaymentMethod> } = {};
    data.forEach((method: IPaymentMethod) => {
        const unifiedCategory = method.category === "1" || method.category === "2" ? "1_2" : method.category;

        if (!groupedPaymentMethods[unifiedCategory]) {
            groupedPaymentMethods[unifiedCategory] = [];
        }

        groupedPaymentMethods[unifiedCategory].push(method);
    });

    return (
        <Card sx={{ marginTop: position > 1 ? 4 : 0 }}>
            <CardHeader
                title="Metode Pembayaran"
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: "2rem !important",
                        letterSpacing: "0.15px !important",
                    },
                }}
            />
            <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                {Object.entries(groupedPaymentMethods).map(([category, methods]) => (
                    <Accordion
                        key={category}
                        expanded={value.selectedCategory === category}
                        onChange={(e) => {
                            onChange(
                                "selectedCategory",
                                category === value.selectedCategory ? "" : category.toString(),
                            );
                        }}
                    >
                        <AccordionSummary>
                            <Typography>{accordionTitle(category)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 4,
                                }}
                            >
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
                                                        : method.fee,
                                                );
                                                onChange("paymentMethodCd", method.cd);
                                                onChange("paymentMethod", method);
                                                onChange("promoCode", "");
                                                onChange("promo", "");
                                            }
                                        }}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            p: 2,
                                            flexWrap: "wrap",
                                            border: `2px solid ${
                                                method.id === value.paymentMethodId ? "#757ce8" : "#eaeaea"
                                            }`,
                                            ...(value.totalAmountBeforeFee &&
                                            value.totalAmountBeforeFee > method.minAmount &&
                                            value.totalAmountBeforeFee < method.maxAmount
                                                ? {
                                                      cursor: "pointer",
                                                  }
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
                                        <Typography variant="caption">
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
                                                              : method.fee),
                                                  )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    );
};

export default PaymentMethod;
