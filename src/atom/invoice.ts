"use state";

import { atom } from "recoil";

export const invoiceState = atom({
    key: "payment-atom",
    default: {
        isExpired: false,
    },
});
