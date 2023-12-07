"use state";

import { atom } from "recoil";

export const orderHistoryState = atom({
    key: "order-history-atom",
    default: {
        data: [] as IOrder[],
        keySearch: "",
        limit: 10,
        order: "DESC",
        sort: "createdAt",
        page: 1,
        analytics: {},
    } as IOrderWithAnalitycsPaginationWithDetailWithSearch,
});
