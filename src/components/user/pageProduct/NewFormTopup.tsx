"use client";

import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState } from "@/atom/cartState";
import { formCashtag } from "@/atom/formCashtag";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Typography,
  Stack,
  Card,
} from "@/lib/mui";
import AdditionalData from "./AdditionalData";
import ConfirmCheckout from "./ConfirmCheckout";
import DenomList from "./DenomList";
import GameData from "./GameData";
import GroupedDenomList from "./GroupedDenomList";
import PaymentMethod from "./PaymentMethod";
import ProfileGame from "./ProfileGame";
import PromoCode from "./PromoCode";
import { useRouter } from "next/navigation";
import Quantity from "./Quantity";
import Link from "next/link";
import MobileNumber from "./MobileNumber";
import useDevice from "@/@core/hooks/useDevice";
import ProductReview from "./ProductReview";
import { toast } from "react-toastify";
import Image from "next/image";
import { currencyConverter } from "@/lib/currencyConverter";
import { FeeType } from "@/enum";

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

  useEffect(() => {
    const getUserBalance = async () => {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/user/balance`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        }
      );

      if (!req.ok) {
        console.error("failed to fetch user balance status : " + req.status);
      } else {
        const balance = await req.json();
        setBalance(balance.value || 0);
      }
    };

    getUserBalance();
  }, []);

  useEffect(() => {
    if (products.products.length) {
      handleChange("productId", products.products[0].id);
      handleChange("product", products.products[0]);
      handleChange("amount", products.products[0].price);
    }
  }, []);

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
            <Stack gap={6}>
              <ProfileGame denoms={products} />
              <Stack sx={{ display: { xs: "none", sm: "flex" } }} gap={6}>
                <ProductReview gameId={products.id} />
                {/* <FAQ /> */}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack gap={6}>
              <GameData
                position={products.type === "topup" ? 1 : 0}
                value={data}
                data={products}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
              {!products.isGrouped && (
                <DenomList
                  position={products.type === "topup" ? 2 : 1}
                  value={data}
                  data={products}
                  onChange={(key: any, value: any) => handleChange(key, value)}
                />
              )}
              {products.isGrouped && (
                <GroupedDenomList
                  position={products.type === "topup" ? 2 : 1}
                  value={data}
                  data={products}
                  onChange={(key: any, value: any) => handleChange(key, value)}
                />
              )}
              <Quantity
                position={products.type === "topup" ? 3 : 2}
                value={data}
                data={products}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
              <PaymentMethod
                balance={balance}
                position={products.type === "topup" ? 4 : 3}
                value={data}
                data={paymentsMethod.length > 0 && paymentsMethod}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
              <AdditionalData
                position={products.type === "topup" ? 5 : 4}
                value={data}
                data={products}
                onChange={(key: any, value: any) => handleChange(key, value)}
              />
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <MobileNumber
                    position={
                      products.type === "topup" &&
                      data.paymentMethodCd === "ID_JENIUSPAY"
                        ? 6
                        : products.type === "topup" ||
                          data.paymentMethodCd === "ID_JENIUSPAY"
                        ? 5
                        : 4
                    }
                    value={data}
                    data={products}
                    onChange={(key: any, value: any) =>
                      handleChange(key, value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PromoCode
                    position={
                      products.type === "topup" &&
                      data.paymentMethodCd === "ID_JENIUSPAY"
                        ? 7
                        : products.type === "topup" ||
                          data.paymentMethodCd === "ID_JENIUSPAY"
                        ? 6
                        : 5
                    }
                    value={data}
                    data={products}
                    onChange={(key: any, value: any) =>
                      handleChange(key, value)
                    }
                  />
                </Grid>
              </Grid>
            </Stack>

            <Card
              sx={{
                display: { xs: "block", md: "none" },
                width: "100vw",
                borderRadius: "1.5rem 1.5rem 0 0",
                position: "fixed",
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(10px)",
                zIndex: 50,
                padding: 4,
              }}
            >
              <Stack direction="row" gap={4}>
                <Box borderRadius={{ xs: 1.5, lg: 2 }} overflow={"hidden"}>
                  <Image
                    alt={products.name}
                    src={data.product.logoDenom || products.logoUrl}
                    width={60}
                    height={60}
                  />
                </Box>
                <Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {data.product.name || "pilih denom"} x{" "}
                      {data.quantity || 0} Qty
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontSize={15}
                      fontWeight={600}
                    >
                      {data.paymentMethod.id &&
                        currencyConverter(
                          data.paymentMethod.providerCd === "TOKOPAY" &&
                            data.paymentMethod.category === "6"
                            ? Math.ceil(
                                (data.totalAmountBeforeFee +
                                  (data.paymentMethod.feeType ===
                                  FeeType.PERCENTAGE
                                    ? (data.totalAmountBeforeFee *
                                        data.paymentMethod.fee) /
                                      100
                                    : data.paymentMethod.fee)) /
                                  1000
                              ) * 1000
                            : data.totalAmountBeforeFee +
                                (data.paymentMethod.feeType ===
                                FeeType.PERCENTAGE
                                  ? (data.totalAmountBeforeFee *
                                      data.paymentMethod.fee) /
                                    100
                                  : data.paymentMethod.fee)
                        )}
                      {data.paymentMethod.id
                        ? " - " + data.paymentMethod.name
                        : "Pilih Metode Pembayaran"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={10}
                    >
                      proses instan
                    </Typography>
                  </Box>
                </Box>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ marginTop: 4 }}
                onClick={() => {
                  data.paymentMethod.cd === "GASSKEUN_USER" &&
                  balance < data.totalAmountBeforeFee
                    ? toast.error("Gasskeun Coin mu Tidak Mencukupi")
                    : setModalOpen(true);
                }}
                disabled={isDisabled}
              >
                Beli Sekarang
              </Button>
            </Card>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ marginTop: 4, display: { xs: "none", md: "block" } }}
              onClick={() => {
                data.paymentMethod.cd === "GASSKEUN_USER" &&
                balance < data.totalAmountBeforeFee
                  ? toast.error("Gasskeun Coin mu Tidak Mencukupi")
                  : setModalOpen(true);
              }}
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
            <Stack sx={{ display: { xs: "flex", sm: "none" } }} gap={6}>
              <ProductReview gameId={products.id} />
              {/* <FAQ /> */}
            </Stack>
          </Grid>
        </Grid>

        {/* <GameContent /> */}
      </Box>
    )
  );
};

export default NewFormTopup;
