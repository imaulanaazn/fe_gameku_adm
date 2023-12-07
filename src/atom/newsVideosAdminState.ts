"use client";

import { INewsVideos, INewsVideosPaginationWithSearch } from "@/interfaces/newsVideo";
import { atom } from "recoil";

export const newsVideosAdminState = atom({
    key: "news-videos-admin-atom",
    default: {
        data: [] as INewsVideos[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as INewsVideosPaginationWithSearch,
});
