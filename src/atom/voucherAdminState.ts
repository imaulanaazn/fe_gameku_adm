"use client";

import { atom } from "recoil";

export const voucherAdminState = atom({
    key: "voucher-admin-atom",
    default: {
        data: [] as IVoucherGame[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
    } as IVoucherGamePaginationWithSearch,
});
