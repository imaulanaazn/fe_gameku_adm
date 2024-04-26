import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";

const Quantity = ({ data, value, onChange, position }: any) => {
  return (
    <Card
      sx={{
        marginTop: position > 1 ? { xs: 6, md: 8 } : 0,
        borderRadius: "0.75rem",
        background:
          "#ffffff url(/images/topup-form-step-3.svg) no-repeat right top",
        backgroundSize: "150px",
      }}
    >
      <CardHeader
        title="Jumlah Pembelian"
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
          value={value.quantity}
          fullWidth
          id="total"
          label="Jumlah Pembelian"
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
