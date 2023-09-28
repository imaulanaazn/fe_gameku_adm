"use client";

import { cartState } from "@/atom/cartState";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";

const NomorWhatsapp = () => {
    const [cart, setCart] = useRecoilState(cartState);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Nomor Whatsapp
            </div>
            {cart.paymentMethod.cd === "ID_OVO" && (
                <div
                    className={`bg-yellow-200 text-yellow-800 p-4 h-fit w-full rounded-lg flex gap-3 items-center text-sm mt-3`}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <p>Pastikan nomornya sesuai dengan nomor OVOmu!</p>
                </div>
            )}
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
