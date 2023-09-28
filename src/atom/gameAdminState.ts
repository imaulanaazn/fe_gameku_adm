"use client";

import { atom } from "recoil";

export const gameAdminState = atom({
    key: "game-admin-atom",
    default: {
        data: [] as IGame[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IGamePaginationWithSearch,
});
