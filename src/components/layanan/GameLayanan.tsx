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
  const [limit, setLimit] = useState(6);
  const slicedGames = filteredGames.slice(0, limit);

  const handleClickExpandGame = () => {
    if (limit > filteredGames.length) {
      setLimit(6);
    } else {
      setLimit((prevLimit) => prevLimit + 24);
    }
  };

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
    setLimit(24);

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
      <div className="container flex gap-5 mt-10 flex-wrap justify-center">
        {slicedGames &&
          slicedGames.map((data) => <Game data={data} key={data.id} />)}
      </div>
      {limit < filteredGames.length && (
        <button
          onClick={handleClickExpandGame}
          className="mx-auto flex items-center gap-2 bg-white mt-8 lg:text-sm text-primary-900 rounded-md py-2 px-4 font-semibold lg:font-medium hover:bg-primary-100"
        >
          Muat lebih banyak
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      )}
    </>
  );
};

export default GameLayanan;
