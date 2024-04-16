import { Card, CardContent, CardHeader, TextField } from "@mui/material";
import React from "react";

const Quantity = ({ data, value, onChange, position }: any) => {
    return (
        <Card sx={{ marginTop: position > 1 ? 4 : 0 }}>
            <CardHeader
                title="Jumlah Pembelian"
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: "2rem !important",
                        letterSpacing: "0.15px !important",
                    },
                }}
            />
            <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                <TextField
                    value={value.quantity}
                    fullWidth
                    id="total"
                    label="Jumlah Pembelian"
                    sx={{ marginBottom: 2.5 }}
                    onChange={(e) => {
                        onChange("quantity", e.target.value.replace(/\D/, ""));
                        onChange("promoCode", "");
                        onChange("promo", "");
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default Quantity;
