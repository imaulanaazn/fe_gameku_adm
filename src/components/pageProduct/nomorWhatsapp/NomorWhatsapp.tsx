"use client";

import { cartState } from "@/atom/cartState";
import { useRecoilState } from "recoil";

const NomorWhatsapp = () => {
    const [cart, setCart] = useRecoilState(cartState);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Nomor Whatsapp
            </div>
            <div className="grid grid-cols-1 mt-5">
                <input
                    type="text"
                    name="noWhatsapp"
                    id="noWhatsapp"
                    className="p-4 rounded-md text-sm"
                    onChange={(e) => setCart({ ...cart, mobileNumber: e.target.value })}
                    value={cart.mobileNumber}
                />
            </div>
        </div>
    );
};

export default NomorWhatsapp;
