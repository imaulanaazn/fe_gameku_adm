"use client";

import { atom } from "recoil";

interface ICart {
    product: Partial<IProductsGame>;
    quantity: number;
    paymentMethod: Partial<IPaymentMethod>;
    detailAccount?: {
        userId?: string;
        serverId?: string;
    };
    mobileNumber: string;
    promoCode?: string;
    prices: number;
    totalAmount: number;
    fee: number;
}

export const cartState = atom({
    key: "cart-atom",
    default: {
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
        totalAmount: 0,
        fee: 0,
    } as ICart,
});
