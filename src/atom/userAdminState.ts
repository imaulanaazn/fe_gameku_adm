"use client";

import { atom, selector } from "recoil";

export const userAdmin = atom({
    key: "user-admin-atom",
    default: {
        data: [] as IUser[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IUserPaginationWithSearch,
});
