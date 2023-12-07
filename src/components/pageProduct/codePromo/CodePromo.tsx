"use client";

import { cartState } from "@/atom/cartState";
import { msgState } from "@/atom/msgState";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

const CodePromo: React.FC<{ products: IGameDetail }> = ({ products }) => {
    const [cart, setCart] = useRecoilState(cartState);
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkPromoCode = async () => {
        const user = localStorage.getItem("user");
        const toastId = toast.loading("Mengecek kode promo...");
        setLoading(true);
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/check-promotion", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
            body: JSON.stringify({
                promoCode: cart.promoCode,
                gameId: cart.gameId,
                quantity: cart.quantity,
                productId: cart.product.id,
                mobileNumber: cart.mobileNumber,
                ...(products.type === "topup" && { userId: cart.detailAccount?.userId }),
                ...(products.type === "topup" && products.needServerId && { serverId: cart.detailAccount?.serverId }),
                ...(user && { customerId: JSON.parse(user).id }),
            }),
        });

        const res = await request.json();
        if (request.ok) {
            toast.update(toastId, {
                render: "Kode Promo Bisa Digunakan",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            setCart({ ...cart, pricesAfterDiscount: res.priceAfterDiscount, discount: res.discount });
        } else {
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            setCart({ ...cart, promoCode: "" });
        }
        setLoading(false);
    };

    const handleCheckPromoCode = (e: any) => {
        e.preventDefault();
        checkPromoCode();
    };

    useEffect(() => {
        if (
            !cart.promoCode ||
            !cart.product ||
            !cart.quantity ||
            !cart.mobileNumber ||
            (products.type === "topup" && !cart.detailAccount?.userId) ||
            (products.type === "topup" && products.needServerId && !cart.detailAccount?.serverId)
        ) {
            setAllowed(false);
        } else {
            setAllowed(true);
        }
    }, [
        cart.promoCode,
        cart.product,
        cart.quantity,
        cart.detailAccount?.serverId,
        cart.detailAccount?.userId,
        cart.mobileNumber,
    ]);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
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
                {loading ? (
                    <div className="sm:w-44 w-20 bg-gray-400 text-black py-2 flex justify-center items-center rounded-lg absolute top-1 lg:right-4 right-1 cursor-wait text-sm">
                        <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                    </div>
                ) : allowed ? (
                    cart.pricesAfterDiscount !== 0 ? (
                        <div className="sm:w-44 bg-gray-400 text-black py-3 px-5 flex justify-center items-center rounded-lg absolute top-1 lg:right-4 right-1 cursor-not-allowed text-sm">
                            Digunakan
                        </div>
                    ) : (
                        <div
                            onClick={handleCheckPromoCode}
                            className="sm:w-44 w-20 text-white bg-[#B72025] py-3 flex justify-center items-center rounded-lg absolute top-1 lg:right-4 right-1 cursor-pointer text-sm"
                        >
                            Cek Kode
                        </div>
                    )
                ) : (
                    <div className="sm:w-44 w-20 bg-gray-400 text-black py-3 flex justify-center items-center rounded-lg absolute top-1 lg:right-4 right-1 cursor-not-allowed text-sm">
                        Cek Kode
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodePromo;
