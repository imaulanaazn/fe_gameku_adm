"use client";

import { useEffect, useState } from "react";
import ListDenom from "./listDenom/ListDenom";
import ListPaymentsMethod from "./listPaymentsMethod/ListPaymentsMethod";
import DetailAccount from "./detailAccount/DetailAccount";
import NomorWhatsapp from "./nomorWhatsapp/NomorWhatsapp";
import CodePromo from "./codePromo/CodePromo";
import TotalPayments from "./totalPayments/TotalPayments";
import DescProduct from "./descProduct/DescProduct";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState } from "@/atom/cartState";
import CashTag from "./inputCashTag/CashTag";
import { formCashtag } from "@/atom/formCashtag";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@/lib/mui";
import AdditionalData from "./new/AdditionalData";
import ConfirmCheckout from "./new/ConfirmCheckout";
import DenomList from "./new/DenomList";
import GameData from "./new/GameData";
import GroupedDenomList from "./new/GroupedDenomList";
import PaymentMethod from "./new/PaymentMethod";
import ProfileGame from "./new/ProfileGame";
import PromoCode from "./new/PromoCode";
import { useRouter } from "next/navigation";
import Quantity from "./new/Quantity";
import Link from "next/link";
import MobileNumber from "./new/MobileNumber";
import { Container } from "@mui/system";
import useDevice from "@/@core/hooks/useDevice";
import ProductReview from "./ProductReview/ProductReview";

interface IFormProps {
  products: IGameDetail;
  paymentsMethod: IPaymentMethod[];
}

const NewFormTopup: React.FC<IFormProps> = ({ products, paymentsMethod }) => {
  const [cart, setCart] = useRecoilState(cartState);
  const cashtag = useRecoilValue(formCashtag);
  useEffect(() => {
    setCart({
      gameId: products.id,
      product: {},
      quantity: 0,
      paymentMethod: {},
      detailAccount: {
        userId: "",
        serverId: "",
      },
      mobileNumber: "",
      promoCode: "",
      prices: 0,
      pricesAfterDiscount: 0,
      totalAmount: 0,
      discount: 0,
      fee: 0,
      cashtag: "",
    });
  }, []);

  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupedDenoms, setGroupedDenoms] = useState<any>(null);
  const [data, setData] = useState({
    productId: "",
    paymentMethodId: "",
    quantity: 1,
    promoCode: "",
    paymentMethodCd: "",
    mobileNumber: "",
    cashtag: "",
    amount: 0,
    feeAmount: 0,
    totalAmount: 0,
    totalAmountBeforeFee: 0,
    userId: "",
    serverId: "",
    selectedCategory: "",
    paymentMethod: "" as any,
    product: "" as any,
    promoAmount: 0,
    promo: "" as any,
    tabActive: "",
    gameId: products.id,
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const device = useDevice();

  const handleChange = (key: keyof typeof data, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (
      data.totalAmountBeforeFee > data.paymentMethod.maxAmount ||
      data.totalAmountBeforeFee < data.paymentMethod.minAmount
    ) {
      setData((prev) => ({
        ...prev,
        paymentMethod: "",
        paymentMethodCd: "",
        paymentMethodId: "",
      }));
    }
  }, [data.totalAmountBeforeFee, data.paymentMethod]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      totalAmountBeforeFee: data.amount * data.quantity,
    }));
  }, [data.amount, data.quantity]);

  useEffect(() => {
    if (
      !data.mobileNumber ||
      !data.productId ||
      !data.paymentMethodId ||
      data.quantity <= 0 ||
      (products && products.type === "topup" && !data.userId) ||
      (products && products.needServerId && !data.serverId) ||
      (data.paymentMethod.cd === "ID_JENIUSPAY" && !data.cashtag)
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    data.productId,
    data.paymentMethodId,
    data.quantity,
    data.promoCode,
    data.mobileNumber,
    data.cashtag,
    data.userId,
    data.serverId,
    products,
  ]);

  useEffect(() => {
    if (products?.isGrouped) {
      const firstCategory = products.groupedDenoms[0];
      handleChange("tabActive", firstCategory.id);
    }
  }, [products]);
  return (
    products && (
      <Box sx={{ position: "relative", pb: { xs: 12, md: 14 } }}>
        <Box sx={{ py: 5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" className="text-primary-900">
              Home
            </Link>
            <Typography color="text.primary">{products.name}</Typography>
          </Breadcrumbs>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <ProfileGame denoms={products} />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ProductReview />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <GameData
              position={1}
              value={data}
              data={products}
              onChange={(key: any, value: any) => handleChange(key, value)}
            />
            {!products.isGrouped && (
              <DenomList
                position={2}
                value={data}
                data={products}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
            )}
            {products.isGrouped && (
              <GroupedDenomList
                position={3}
                value={data}
                data={products}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
            )}
            <Quantity
              position={3}
              value={data}
              data={products}
              onChange={(key: any, value: any) => handleChange(key, value)}
            />
            <PaymentMethod
              position={4}
              value={data}
              data={paymentsMethod.length > 0 && paymentsMethod}
              onChange={(key: any, value: any) => handleChange(key, value)}
            />
            <AdditionalData
              position={5}
              value={data}
              data={products}
              onChange={(key: any, value: any) => handleChange(key, value)}
            />
            <Grid container spacing={{ xs: 0, md: 6 }}>
              <Grid item xs={12} md={6}>
                <MobileNumber
                  position={5}
                  value={data}
                  data={products}
                  onChange={(key: any, value: any) => handleChange(key, value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PromoCode
                  position={3}
                  value={data}
                  data={products}
                  onChange={(key: any, value: any) => handleChange(key, value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ marginTop: 4 }}
              onClick={() => setModalOpen(true)}
              disabled={isDisabled}
            >
              Beli Sekarang
            </Button>
            <ConfirmCheckout
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              dataCheckout={{
                ...data,
                products,
              }}
              balance={balance}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <ProductReview />
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export default NewFormTopup;
