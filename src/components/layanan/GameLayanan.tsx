"use client";

import { use, useEffect, useState } from "react";
import Game from "../global/game/Game";
import { useRecoilState, useRecoilValue } from "recoil";
import { layananState } from "@/atom/layananState";

const GameLayanan: React.FC<{ games: IGame[] }> = ({ games }) => {
    const category = useRecoilValue(layananState);
    const [gamesCateg, setGameCateg] = useState<IGame[] | undefined>();

    const requestGame = async (path: string) => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await request.json();
        if (request.ok) {
            setGameCateg(res);
        } else {
            setGameCateg([]);
        }
    };

    useEffect(() => {
        const searchKey = category.search ? `search=${category.search}` : undefined;
        if (category.id === "all") {
            requestGame(`/v1/games${searchKey ? "?" + searchKey : ""}`);
        } else if (category.id === "popular") {
            requestGame(`/v1/games?isPopular=true${searchKey ? "&" + searchKey : ""}`);
        } else {
            requestGame(`/v1/games?categoryId=${category.id}${searchKey ? "&" + searchKey : ""}`);
        }
    }, [category.id, category.search]);

    return (
        <div className="container flex gap-5 mt-10 flex-wrap md:justify-start justify-center">
            {gamesCateg
                ? gamesCateg.map((data) => <Game data={data} key={data.id} />)
                : games.map((data) => <Game data={data} key={data.id} />)}
        </div>
    );
};

export default GameLayanan;
