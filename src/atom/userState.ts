"use client";

import { atom, selector } from "recoil";

export const userState = atom({
    key: "user-atom",
    default: {} as IUser,
});
