"use client";

import { IPromotion, IPromotionPaginationWithSearch } from "@/interfaces/promotion";
import { atom } from "recoil";

export const promoCodeAdminState = atom({
    key: "promo-code-admin-atom",
    default: {
        data: [] as IPromotion[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IPromotionPaginationWithSearch,
});
