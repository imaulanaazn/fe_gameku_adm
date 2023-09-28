import { atom } from "recoil";

export interface IMessage {
    id: string;
    type: "error" | "success" | "warning" | "info";
    msg: string;
    time: number;
}

export const msgState = atom<IMessage[]>({
    key: "msg-atom",
    default: [],
});
