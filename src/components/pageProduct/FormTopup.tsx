"use client";

import { useEffect, useState } from "react";
import ListDenom from "./listDenom/ListDenom";
import Quantity from "./Quantity/Quantity";
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
import Link from "next/link";

interface IFormProps {
    products: IGameDetail;
    paymentsMethod: IPaymentMethod[];
}

const FormTopup: React.FC<IFormProps> = ({ products, paymentsMethod }) => {
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
    return (
        products && (
            <div className="relative">
                <div className="pt-5">
                    <div className="lg:px-10 px-5 container mx-auto">
                        <p className="font-semibold text-sm">
                            <Link href="/" className="text-blue-800">
                                Home
                            </Link>{" "}
                            / {products.name}
                        </p>
                        <div className="flex lg:gap-10 flex-wrap lg:flex-nowrap">
                            <DescProduct products={products} />
                            <div className="lg:w-2/3 w-full flex flex-wrap flex-col mt-5">
                                <ListDenom products={products.products} defaultLogo={products.logoDenom} />
                                <Quantity />
                                <ListPaymentsMethod paymentsMethod={paymentsMethod} />
                                {products.type === "topup" && <DetailAccount products={products} />}
                                <NomorWhatsapp />
                                {cashtag && <CashTag />}
                                <CodePromo products={products} />
                            </div>
                        </div>
                    </div>
                </div>
                <TotalPayments />
            </div>
        )
    );
};

export default FormTopup;
