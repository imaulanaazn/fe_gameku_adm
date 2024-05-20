"use client";

import { cartState } from "@/atom/cartState";
import { formCashtag } from "@/atom/formCashtag";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Container } from "@/lib/mui";

const TotalPayments = () => {
  const router = useRouter();
  const cart = useRecoilValue(cartState);
  const [allowed, setAllowed] = useState(false);
  const [allowedButton, setAllowedButton] = useState(false);
  const [formatTotalAmount, setFormatTotalAmount] = useState("Rp. 0");
  const [formatPricesAfterDiscount, setFormatPricesAfterDiscount] =
    useState("Rp. 0");
  const [formatPricesBeforeDiscount, setFormatPricesBeforeDiscount] =
    useState("Rp. 0");
  const cashtag = useRecoilValue(formCashtag);
  const [loading, setLoading] = useState(false);

  const postCheckout = async () => {
    setLoading(true);
    const user = localStorage.getItem("user");
    const toastId = toast.loading("Memproses checkout");
    const request = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/order",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        cache: "no-cache",
        body: JSON.stringify({
          userId: cart.detailAccount?.userId,
          serverId: cart.detailAccount?.serverId,
          productId: cart.product.id,
          paymentId: cart.paymentMethod.id,
          mobileNumber: cart.mobileNumber,
          cashtag: cart.cashtag,
          quantity: cart.quantity,
          promoCode: cart.promoCode,
          ...(user && { customerId: JSON.parse(user).id }),
        }),
      }
    );

    const res = await request.json();
    if (request.ok) {
      router.push(`/payment/${res.invoice}`);
      toast.update(toastId, {
        render: "Checkout berhasil",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render:
          res?.message || "Gagal checkout silahkan coba beberapa saat lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    setLoading(false);
  };

  const handleCheckout = () => {
    if (allowedButton && allowed) {
      postCheckout();
    }
  };

  useEffect(() => {
    if (
      !cart.product.id ||
      !cart.totalAmount ||
      !cart.paymentMethod.id ||
      !cart.quantity
    ) {
      setAllowed(false);
    } else {
      setAllowed(true);

      const formatIdr = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(cart.totalAmount);

      setFormatTotalAmount(formatIdr);
    }
  }, [cart.product.id, cart.totalAmount, cart.paymentMethod.id, cart.quantity]);

  useEffect(() => {
    const formatIdr = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cart.pricesAfterDiscount + cart.fee);

    setFormatPricesAfterDiscount(formatIdr);
  }, [cart.pricesAfterDiscount, cart.fee]);

  useEffect(() => {
    const formatIdr = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cart.prices + cart.fee);

    setFormatPricesBeforeDiscount(formatIdr);
  }, [cart.prices, cart.fee]);

  useEffect(() => {
    if (
      !cart.product.id ||
      !cart.totalAmount ||
      !cart.paymentMethod.id ||
      !cart.mobileNumber ||
      (cashtag && !cart.cashtag)
    ) {
      setAllowedButton(false);
    } else {
      setAllowedButton(true);
    }
  }, [
    cart.product.id,
    cart.totalAmount,
    cart.paymentMethod.id,
    cart.mobileNumber,
    cashtag,
    cart.cashtag,
  ]);

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: "gray", position: "sticky", bottom: 0 }}
    >
      {/* <div className="bg-black text-white w-full sticky bottom-0 lg:px-20 lg:py-5 flex justify-end items-center gap-5 font-montserrat p-5"> */}
      <div className="text-sm">
        {allowed ? (
          <>
            <p>Total</p>
            <p className="mt-1 text-xs">
              {cart.product.name} x {cart.quantity}, {cart.paymentMethod.name}
            </p>
            {cart.pricesAfterDiscount === 0 ? (
              <p className="font-extrabold text-xl">{formatTotalAmount}</p>
            ) : (
              <>
                <div className="relative w-fit">
                  <p className="font-bold text-sm text-gray-500">
                    {formatPricesBeforeDiscount}
                  </p>
                  <div className="absolute w-full h-px bg-gray-500 top-1/2"></div>
                </div>
                <p className="font-extrabold text-xl">
                  {formatPricesAfterDiscount}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="font-extrabold lg:text-base text-sm">
            Pilih Denom yang kamu inginkan sekarang!
          </p>
        )}
      </div>
      {loading ? (
        <div className="py-2 w-48 bg-gray-400 text-black cursor-wait rounded-lg text-sm flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
        </div>
      ) : (
        <div
          onClick={handleCheckout}
          className={`py-3 w-48 ${
            allowedButton
              ? "bg-[#B72025] cursor-pointer"
              : "bg-gray-400 text-black cursor-not-allowed"
          } rounded-lg text-sm flex justify-center items-center`}
        >
          Beli Sekarang!
        </div>
      )}
      {/* </div> */}
    </Container>
  );
};

export default TotalPayments;
