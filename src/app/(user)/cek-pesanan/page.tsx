import FormCekPesanan from "@/components/cek-pesanan/FormCekPesanan";
import ResultCheckPesanan from "@/components/cek-pesanan/ResultCheckPesanan";
import { Metadata } from "next";

const CekPesanan = () => {
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
                <FormCekPesanan />
                <ResultCheckPesanan />
            </div>
        </div>
    );
};

export const generateMetadata = () => {
    return {
        title: "Cek Transaksi - Gasskeun Topup: Pantau Riwayat Pembayaran Game Anda",
        description: undefined,
    } as Metadata;
};

export default CekPesanan;
