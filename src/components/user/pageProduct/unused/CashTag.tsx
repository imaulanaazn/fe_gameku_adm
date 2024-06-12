"use client";

import { cartState } from "@/atom/cartState";
import { useRecoilState } from "recoil";

const Cashtag = () => {
    const [cart, setCart] = useRecoilState(cartState);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Cashtag
            </div>
            <div className="relative grid grid-cols-1 mt-5">
                <div className="absolute p-4 bg-[#B72025] text-white rounded">$</div>
                <input
                    className="shadow appearance-none border rounded w-full p-4 pl-12 text-sm focus:outline-none focus:shadow-outline"
                    id="cashtag"
                    type="text"
                    onChange={(e) => setCart({ ...cart, cashtag: e.target.value })}
                    value={cart.cashtag}
                />
            </div>
        </div>
    );
};

export default Cashtag;
