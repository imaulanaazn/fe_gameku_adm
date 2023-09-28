import Game from "@/components/global/game/Game";
import CompLayanan from "@/components/layanan/CompLayanan";
import ListCategory from "@/components/layanan/ListCategory";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";

const defaultCategory = [
    {
        id: "all",
        name: "Semua Game",
    },
    { id: "popular", name: "Game Popular" },
];

const Layanan = async () => {
    const gameCategories = await sendRequest<IGameCategory[]>("/api/v1/games-category");
    const games = await sendRequest<IGame[]>("/api/v1/games");

    return (
        <div className="container mx-auto mt-10 px-5 lg:px-0">
            <h1 className="font-pulse text-2xl">Daftar Layanan</h1>
            <CompLayanan defaultCategory={defaultCategory} gameCategories={gameCategories.data} games={games.data} />
        </div>
    );
};

export default Layanan;

export const generateMetadata = ({ params }: { params: string }) => {
    return {
        title: "Layanan Top-Up Game Terbaik | Gasskeun Topup",
        description:
            "Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI DANA, OVO, dll",
    } as Metadata;
};
