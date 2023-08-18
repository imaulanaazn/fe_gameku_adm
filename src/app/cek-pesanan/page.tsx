"use client";

import React, { useState } from "react";

const CekPesanan = () => {
    const [trxNo, setTrxNo] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };
    return (
        <div
            style={{
                // backgroundImage: `url('https://via.placeholder.com/1000x1000')`,
                backgroundColor: "black",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
            className="w-full h-fit mx-auto grid align-middle"
        >
            <div className="mx-auto pt-10 h-fit min-h-screen text-center w-full p-5 font-pulse text-white flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-10">
                    <p className="font-pulse font-light text-xs tracking-widest">SILAHKAN</p>
                    <h1 className="font-pulse font-semibold text-3xl">Cek Pesanan</h1>
                </div>
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
                    <button type="submit" className="w-full bg-[#B72025] text-white py-5 hover:bg-[#c5474c]">
                        Cek Pesanan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CekPesanan;
