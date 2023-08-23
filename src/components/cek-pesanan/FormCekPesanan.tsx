"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const FormCekPesanan = () => {
    const [trxNo, setTrxNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [allowed, setAllowed] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        setLoading(false);
    };

    useEffect(() => {
        if (!trxNo) {
            setAllowed(false);
        } else {
            setAllowed(true);
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
