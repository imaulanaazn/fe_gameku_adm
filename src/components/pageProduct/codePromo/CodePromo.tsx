"use client";

import { cartState } from "@/atom/cartState";
import { useRecoilState } from "recoil";

const CodePromo = () => {
    const [cart, setCart] = useRecoilState(cartState);
    const handleCheckPromoCode = (e: any) => {
        e.preventDefault();
    };

    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Code Promo
            </div>
            <div className="grid grid-cols-1 mt-5 relative">
                <input
                    type="text"
                    name="promoCode"
                    id="promoCode"
                    className="p-4 rounded-md text-sm pr-24"
                    value={cart.promoCode}
                    onChange={(e) => setCart({ ...cart, promoCode: e.target.value })}
                />
                <div
                    onClick={handleCheckPromoCode}
                    className="sm:w-44 w-20 text-white py-3 bg-[#B72025] flex justify-center items-center rounded-lg absolute top-1 lg:right-4 right-1 cursor-pointer text-sm"
                >
                    Cek Kode
                </div>
            </div>
        </div>
    );
};

export default CodePromo;
