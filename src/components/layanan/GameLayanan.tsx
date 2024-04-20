"use client";

import { use, useEffect, useState } from "react";
import Game from "../global/game/Game";
import { useRecoilState, useRecoilValue } from "recoil";
import { layananState } from "@/atom/layananState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const GameLayanan: React.FC<{ games: IGame[] }> = ({ games }) => {
  const category = useRecoilValue(layananState);
  const [filteredGames, setFilteredGames] = useState<IGame[] | []>(games);

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
      setFilteredGames(res);
    } else {
      setFilteredGames([]);
    }
  };

  useEffect(() => {
    const searchKey = category.search ? `search=${category.search}` : undefined;
    if (category.id === "all") {
      requestGame(`/v1/games${searchKey ? "?" + searchKey : ""}`);
    } else if (category.id === "popular") {
      requestGame(
        `/v1/games?isPopular=true${searchKey ? "&" + searchKey : ""}`
      );
    } else {
      requestGame(
        `/v1/games?categoryId=${category.id}${searchKey ? "&" + searchKey : ""}`
      );
    }
  }, [category.id, category.search]);

  return (
    <>
      <div className="h-screen overflow-y-scroll overflow-x-hidden pb-4 pr-4">
        <div className="grid grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
          {filteredGames &&
            filteredGames.map((data) => <Game data={data} key={data.id} />)}
        </div>
      </div>
    </>
  );
};

export default GameLayanan;
