"use client";

import { IImageCarousel, IImageCarouselPaginationWithSearch } from "@/interfaces/carousels";
import { atom } from "recoil";

export const carouselAdminState = atom({
    key: "carousel-admin-atom",
    default: {
        data: [] as IImageCarousel[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IImageCarouselPaginationWithSearch,
});
