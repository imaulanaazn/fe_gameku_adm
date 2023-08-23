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
import { useRecoilState } from "recoil";
import { cartState } from "@/atom/cartState";

interface IFormProps {
    products: IGameDetail;
    paymentsMethod: IPaymentMethod[];
}

const FormTopup: React.FC<IFormProps> = ({ products, paymentsMethod }) => {
    return (
        <>
            {products && (
                <>
                    <div className="lg:px-10 px-5 container mx-auto">
                        <p className="font-bold text-x">Home / {products.name}</p>
                        <div className="flex gap-10 flex-wrap lg:flex-nowrap">
                            <DescProduct products={products} />
                            <div className="lg:w-2/3 w-full flex flex-wrap flex-col mt-10">
                                <div>
                                    <ListDenom
                                        products={products.products}
                                        defaultLogo={products.logoDenom || products.logoUrl}
                                    />
                                    <Quantity />
                                    <ListPaymentsMethod paymentsMethod={paymentsMethod} />
                                    <DetailAccount />
                                    <NomorWhatsapp />
                                    <CodePromo />
                                </div>
                            </div>
                        </div>
                    </div>
                    <TotalPayments />
                </>
            )}
        </>
    );
};

export default FormTopup;
