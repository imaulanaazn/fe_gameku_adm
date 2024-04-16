import { Card, CardContent, CardHeader, TextField } from "@mui/material";
import React from "react";

const AdditionalData = ({ data, value, onChange, position }: any) => {
    if (value.paymentMethodCd === "ID_JENIUSPAY") {
        return (
            <Card sx={{ marginTop: position > 1 ? 4 : 0 }}>
                <CardHeader
                    title="Cashtag"
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
                        value={value.cashtag}
                        autoFocus
                        fullWidth
                        id="cashtag"
                        label="Cashtag"
                        sx={{ marginBottom: 2.5 }}
                        onChange={(e) => onChange("cashtag", e.target.value)}
                    />
                </CardContent>
            </Card>
        );
    } else {
        return <></>;
    }
};

export default AdditionalData;
