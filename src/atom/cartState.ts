"use client";

import { atom } from "recoil";

interface ICart {
    gameId: string;
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
    pricesAfterDiscount: number;
    totalAmount: number;
    discount: number;
    fee: number;
    cashtag?: string;
}

export const cartState = atom({
    key: "cart-atom",
    default: {
        gameId: "",
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
    } as ICart,
});
