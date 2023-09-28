"use client";

import { atom } from "recoil";

export const productAdminState = atom({
    key: "product-admin-atom",
    default: {
        data: [] as IProductsGame[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IProductPaginationWithSearch,
});
