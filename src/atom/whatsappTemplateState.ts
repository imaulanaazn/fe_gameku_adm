"use client";

import { atom } from "recoil";

export const whatsappTemplateState = atom({
    key: "whatsapp-template-atom",
    default: [] as ITemplateMessage[],
});
