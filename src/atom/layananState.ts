"use state";

import { atom } from "recoil";

export const layananState = atom({
    key: "layanan-atom",
    default: {
        id: "all",
        search: "",
    },
});
