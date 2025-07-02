import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";

const Quantity = ({ data, value, onChange, position }: any) => {
  function handleInputChange(e: { target: { value: string } }) {
    const numericValue = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (!isNaN(numericValue)) {
      onChange("quantity", numericValue);
    } else {
      onChange("quantity", "");
    }

    onChange("promoCode", "");
    onChange("promo", "");
  }
  return (
    <div id="quantity">
      <Card
        sx={{
          borderRadius: "0.75rem",
          background: `#161721 url(/images/topup-form-step-${position}.svg) no-repeat right top`,
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
              color: "white",
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
              "& .MuiFormLabel-root": { color: "#fb923ce6" },
              "& input": {
                border: "1px solid #fb923ce6",
                borderRadius: "0.4rem",
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                background: "#161721",
              },
            }}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Quantity;
