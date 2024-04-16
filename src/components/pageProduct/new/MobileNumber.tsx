import { Alert } from "@mui/lab";
import { Card, CardContent, CardHeader, TextField } from "@mui/material";
import React from "react";

const MobileNumber = ({ data, value, onChange, position }: any) => {
    return (
        <Card sx={{ marginTop: position > 1 ? 4 : 0 }}>
            <CardHeader
                title="Nomor WhatsApp"
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: "2rem !important",
                        letterSpacing: "0.15px !important",
                    },
                }}
                subheader={
                    value.paymentMethodCd === "ID_OVO" ? (
                        <Alert severity="info">Pastikan nomor whatsapp sama dengan nomor OVO!</Alert>
                    ) : (
                        <></>
                    )
                }
            />
            <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                <TextField
                    value={value.mobileNumber}
                    fullWidth
                    id="mobileNumber"
                    label="Nomor WhatsApp"
                    sx={{ marginBottom: 2.5 }}
                    onChange={(e) => onChange("mobileNumber", e.target.value.replace(/\D/, ""))}
                />
            </CardContent>
        </Card>
    );
};

export default MobileNumber;
