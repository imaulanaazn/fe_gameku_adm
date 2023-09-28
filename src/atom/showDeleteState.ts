"use client";

import { atom } from "recoil";

export const showDeleteState = atom({
    key: "show-delete-atom",
    default: false,
});
