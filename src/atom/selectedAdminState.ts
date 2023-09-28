"use client";

import { atom } from "recoil";

export const selectedAdminState = atom({
    key: "selected-atom",
    default: [] as any[],
});
