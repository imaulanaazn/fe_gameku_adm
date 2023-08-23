"use client";

import { cartState } from "@/atom/cartState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const TotalPayments = () => {
    const [cart, setCart] = useRecoilState(cartState);
    const [allowed, setAllowed] = useState(false);
    const [allowedButton, setAllowedButton] = useState(false);
    const [formatTotalAmount, setFormatTotalAmount] = useState("Rp. 0");

    useEffect(() => {
        if (!cart.product.id || !cart.totalAmount || !cart.paymentMethod.id || !cart.quantity) {
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
        if (!cart.product.id || !cart.totalAmount || !cart.paymentMethod.id || !cart.mobileNumber) {
            setAllowedButton(false);
        } else {
            setAllowedButton(true);
        }
    }, [cart.product.id, cart.totalAmount, cart.paymentMethod.id, cart.mobileNumber]);

    return (
        <div className="bg-black text-white w-full sticky bottom-0 lg:px-20 lg:py-5 flex justify-end items-center gap-5 font-montserrat p-5">
            <div className="text-sm">
                {allowed ? (
                    <>
                        <p>Total</p>
                        <p className="mt-1 text-xs">
                            {cart.product.name} x {cart.quantity}, {cart.paymentMethod.name}
                        </p>
                        <p className="font-extrabold text-xl">{formatTotalAmount}</p>
                    </>
                ) : (
                    <p className="font-extrabold text-base">Pilih Denom yang kamu inginkan sekarang!</p>
                )}
            </div>
            <div
                className={`py-3 w-48 ${
                    allowedButton ? "bg-[#B72025] cursor-pointer" : "bg-gray-400 text-black cursor-not-allowed"
                } rounded-lg text-sm flex justify-center items-center`}
            >
                Beli Sekarang!
            </div>
        </div>
    );
};

export default TotalPayments;
