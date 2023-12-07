"use client";

import { atom } from "recoil";

export const imageAtom = atom({
    key: "image-atom",
    default: {
        logo: "",
        bg_login: "",
        bg_register: "",
        bg_checkorder: "",
        logo_footer: "",
    },
});
