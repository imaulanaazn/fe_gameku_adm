"use client";

import { atom } from "recoil";

export const xenditConfigState = atom({
    key: "xendit-config-atom",
    default: {
        secretKey: "",
        webhookVerifKey: "",
    },
});
