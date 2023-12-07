"use client";

import TableGame from "@/components/admin/Game/TableGame";
import Header from "@/components/admin/Header";
import { useState, useEffect } from "react";
import Loading from "./loading";

const AdminGame = () => {
    const [games, setGames] = useState<IGamePagination>();
    const [loading, setLoading] = useState(true);
    const getGames = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });
        const res = await req.json();
        if (req.ok) {
            setGames({ ...games, ...res });
        }
        setLoading(false);
    };
    useEffect(() => {
        getGames();
    }, []);

    return (
        <>
            {loading && <Loading />}
            {!loading && <>{games && <TableGame game={games} />}</>}
        </>
    );
};

export default AdminGame;
