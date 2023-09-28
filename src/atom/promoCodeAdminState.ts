"use client";

import { IPromotion, IPromotionPaginationWithSearch } from "@/interfaces/promotion";
import { atom } from "recoil";

export const promoCodeAdminState = atom({
    key: "payment-method-admin-atom",
    default: {
        data: [] as IPromotion[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IPromotionPaginationWithSearch,
});
