"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import { currencyConverter } from "@/lib/currencyConverter";
import PaymentMethod from "@/components/user/profile/deposit/PaymentMethod";
import MobileNumber from "@/components/user/profile/deposit/MobileNumber";
import AdditionalData from "@/components/user/profile/deposit/AdditionalData";
import ConfirmCheckout from "@/components/user/profile/deposit/ConfirmCheckout";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Deposit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    paymentMethodId: "",
    paymentMethodCd: "",
    mobileNumber: "",
    cashtag: "",
    feeAmount: 0,
    totalAmount: 0,
    amount: 0,
    paymentMethod: "" as any,
  });

  const [paymentsMethod, setPaymentsMethods] = useState<IPaymentMethod[]>([]);

  const handleChange = (key: keyof typeof data, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  function handleInputChange(e: { target: { value: string } }) {
    const numericValue = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (!isNaN(numericValue)) {
      handleChange("amount", numericValue);
    } else {
      handleChange("amount", "");
    }
  }

  useEffect(() => {
    async function getPaymentsMethods() {
      try {
        const response = await fetch(
          `${BASE_URL}/v1/payments-method?query=9&type=deposit`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("failed to fetch payment method");
        }

        const result = await response.json();

        setPaymentsMethods(result);
      } catch (error) {
        console.error(error);
      }
    }

    getPaymentsMethods();
  }, []);

  useEffect(() => {
    if (
      !data.paymentMethodId ||
      (data.paymentMethod.cd === "ID_JENIUSPAY" && !data.cashtag) ||
      (data.paymentMethod.cd === "OVOPUSH" && !data.mobileNumber)
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    data.paymentMethodId,
    data.mobileNumber,
    data.cashtag,
    data.paymentMethod.cd,
  ]);

  return (
    <div>
      <Card
        sx={{
          borderRadius: "0.75rem",
          background: `#ffffff url(/images/topup-form-step-1.svg) no-repeat right top`,
          backgroundSize: "150px",
        }}
      >
        <CardHeader
          title="Jumlah Deposit"
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
            value={currencyConverter(data.amount)}
            fullWidth
            id="total"
            label="Jumlah Deposit"
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
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>
      <PaymentMethod
        value={data}
        data={paymentsMethod}
        onChange={(key: any, value: any) => handleChange(key, value)}
      />
      {data.paymentMethod.cd === "OVOPUSH" && (
        <MobileNumber
          value={data}
          onChange={(key: any, value: any) => handleChange(key, value)}
        />
      )}
      <AdditionalData
        value={data}
        onChange={(key: any, value: any) => handleChange(key, value)}
      />
      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ marginTop: 4 }}
        onClick={() => setModalOpen(true)}
        disabled={isDisabled}
      >
        Deposit Sekarang
      </Button>
      <ConfirmCheckout
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dataCheckout={{
          ...data,
        }}
      />
    </div>
  );
}
