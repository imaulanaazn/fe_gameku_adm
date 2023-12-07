"use client";

import { ISocialMedia, ISocialMediaPaginationWithSearch } from "@/interfaces/socialMedia";
import { atom } from "recoil";

export const socialMediaAdminState = atom({
    key: "social-media-admin-atom",
    default: {
        data: [] as ISocialMedia[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as ISocialMediaPaginationWithSearch,
});
