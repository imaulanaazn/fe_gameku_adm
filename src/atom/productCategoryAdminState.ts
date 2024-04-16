"use client";

import { atom } from "recoil";

export const productCategoryAton = atom({
    key: "product-category-atom",
    default: {
        data: [] as IproductCategory[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IProductCategoryPaginationWithSearch,
});
