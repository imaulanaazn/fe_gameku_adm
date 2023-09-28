"use client";

import { atom } from "recoil";

export const paymentMethodAdminState = atom({
    key: "payment-method-admin-atom",
    default: {
        data: [] as IPaymentMethod[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IPaymentMethodPaginationWithSearch,
});
