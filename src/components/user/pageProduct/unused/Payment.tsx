"use state";

import { cartState } from "@/atom/cartState";
import { formCashtag } from "@/atom/formCashtag";
import { FeeType } from "@/enum";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

interface IPaymentProps {
    payment: IPaymentMethod;
}

const Payment: React.FC<IPaymentProps> = ({ payment }) => {
    const [cart, setCart] = useRecoilState(cartState);
    const [formatTotalPrices, setFormatTotalPrices] = useState("Rp. 0");
    const [totalPrices, setTotalPrices] = useState(0);
    const [formatMinPrice, setFormatMinPrice] = useState("Rp. 0");
    const [formatMaxPrice, setFormatMaxPrice] = useState("Rp. 0");
    const [fee, setFee] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<Partial<IPaymentMethod>>({});
    const [msgAmount, setMsgAmount] = useState("");
    const setActiveCashtag = useSetRecoilState(formCashtag);

    const [activePaymentClasses, setActivePaymentClasses] = useState("border-2 border-transparent");
    const [paymentClasses, setPaymentClasses] = useState("bg-white cursor-pointer");
    const [allowed, setAllowed] = useState(false);

    const handleChoosePaymentMethod = (pm: IPaymentMethod) => {
        if (allowed && cart.paymentMethod.id !== pm.id) {
            if (pm.cd === "ID_JENIUSPAY") {
                setActiveCashtag(true);
            } else {
                setActiveCashtag(false);
            }
            setPaymentMethod(pm);
            setCart({ ...cart, paymentMethod: pm, totalAmount: totalPrices, fee });
        } else {
            setCart({ ...cart, paymentMethod: {} });
            setPaymentMethod({});
        }
    };

    useEffect(() => {
        const valueFee =
            payment.feeType === FeeType.PERCENTAGE
                ? Math.ceil((payment.fee / 100) * cart.prices * cart.quantity)
                : payment.fee;
        setFee(valueFee);
        let prices = 0;
        if (cart.pricesAfterDiscount !== 0) {
            prices = cart.pricesAfterDiscount + valueFee;
        } else if (cart.prices !== 0) {
            prices = cart.prices + valueFee;
        }

        const formatIdr = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(prices);

        setTotalPrices(prices);
        setFormatTotalPrices(formatIdr);
    }, [cart.prices, cart.quantity, cart.prices, cart.pricesAfterDiscount]);

    useEffect(() => {
        const formatMin = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(payment.minAmount);

        setFormatMinPrice(formatMin);

        const formatMax = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(payment.maxAmount);

        setFormatMaxPrice(formatMax);
        setMsgAmount("Tidak tersedia, Min. " + formatMin);
    }, []);

    useEffect(() => {
        if (totalPrices > payment.maxAmount || totalPrices < payment.minAmount) {
            if (totalPrices > payment.maxAmount) {
                setMsgAmount("Tidak tersedia, Max. " + formatMaxPrice);
            } else {
                setMsgAmount("Tidak tersedia, Min. " + formatMinPrice);
            }
            setPaymentClasses("grayscale cursor-not-allowed");
            setAllowed(false);
        } else {
            setAllowed(true);
            setPaymentClasses("bg-white cursor-pointer");
        }
    }, [totalPrices, formatMaxPrice, formatMinPrice]);

    useEffect(() => {
        if (cart.paymentMethod.id === payment.id) {
            setActivePaymentClasses("border-2 border-[#B72025]");
        } else {
            setActivePaymentClasses("border-2 border-transparent");
        }
    }, [cart.paymentMethod.id]);

    return (
        <div
            onClick={() => handleChoosePaymentMethod(payment)}
            className={`bg-white ${paymentClasses} ${activePaymentClasses} rounded-lg shadow-lg overflow-hidden flex items-center p-2 justify-between font-montserrat`}
        >
            <div className="p-1 w-20 h-10 bg-white shadow-sm shadow-slate-700 rounded-md flex justify-center items-center overflow-hidden">
                <Image
                    src={payment.logo}
                    alt={`Logo Pembayaran Gasskeun Topup ${payment.name}`}
                    className="object-contain"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            {allowed ? (
                <p className="text-xs">{formatTotalPrices}</p>
            ) : (
                <p className="text-[10px] font-bold grayscale-0 text-[#B72025] text-end">{msgAmount}</p>
            )}
        </div>
    );
};

export default Payment;
