import { Alert } from "@mui/lab";
import { Card, CardContent, CardHeader, TextField } from "@mui/material";
import React from "react";

const MobileNumber = ({ data, value, onChange, position }: any) => {
  return (
    <div id="mobile_number">
      <Card
        sx={{
          borderRadius: "0.75rem",
          background: `#ffffff url(/images/topup-form-step-${position}.svg) no-repeat right top`,
          backgroundSize: "150px",
        }}
      >
        <CardHeader
          title="Nomor WhatsApp"
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
              color: "#1F2937",
              fontWeight: "800",
            },
          }}
          subheader={
            value.paymentMethodCd === "ID_OVO" ||
            value.paymentMethodCd === "OVOPUSH" ? (
              <Alert severity="info">
                Pastikan nomor whatsapp sama dengan nomor OVO!
              </Alert>
            ) : (
              <></>
            )
          }
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
            label="Nomor WhatsApp"
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
    </div>
  );
};

export default MobileNumber;
