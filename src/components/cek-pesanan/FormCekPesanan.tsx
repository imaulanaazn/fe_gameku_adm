"use client";

import { msgState } from "@/atom/msgState";
import { orderHistoryState } from "@/atom/orderHistory";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import validator from "validator";

const FormCekPesanan = () => {
    const [trxNo, setTrxNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const [isMobileNo, setIsMobileNo] = useState(false);
    const [orderHistory, setOrderHistory] = useRecoilState(orderHistoryState);
    const setMessage = useSetRecoilState(msgState);

    const getOrderHistory = async () => {
        setLoading(true);
        const querySearch = (isMobileNo ? "mobileNumber=" : "invoice=") + trxNo;
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/order-history?" + querySearch, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
        });

        const res = await result.json();
        if (result.ok) {
            setOrderHistory({ keySearch: querySearch, ...res });
        } else {
            setMessage({
                type: "error",
                time: 3,
                msg: "Kesalahan dalam mengambil riwayat transaksi, silahkan coba lagi",
            });
        }
        setLoading(false);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        getOrderHistory();
    };

    useEffect(() => {
        if (!trxNo) {
            setAllowed(false);
        } else {
            setAllowed(true);

            const convertedNumber = trxNo.replace(/^(\+62|62|0)?(\d+)/, "0$2");
            const mobileNo = validator.isMobilePhone(convertedNumber, "id-ID");
            if (mobileNo) {
                setIsMobileNo(true);
            } else {
                setIsMobileNo(false);
            }
        }
    }, [trxNo]);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md text-xs text-black">
            <div className="mb-4">
                <input
                    type="text"
                    id="text"
                    className="w-full p-4 border"
                    value={trxNo}
                    onChange={(e) => setTrxNo(e.target.value)}
                    required
                    placeholder="Masukkan kode transaksi / No Whatsapp"
                />
            </div>
            {loading ? (
                <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
                    <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                </div>
            ) : allowed ? (
                <button
                    type="submit"
                    className={`w-full py-5 bg-[#B72025] text-white hover:bg-[#c5474c] cursor-pointer`}
                >
                    Cek Pesanan
                </button>
            ) : (
                <div className="bg-gray-400 text-black cursor-not-allowed w-full py-5">Cek Pesanan</div>
            )}
        </form>
    );
};

export default FormCekPesanan;
