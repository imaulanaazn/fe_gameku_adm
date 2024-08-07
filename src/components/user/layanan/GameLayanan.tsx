"use client";

import { use, useEffect, useState } from "react";
import Game from "../../global/game/Game";
import { useRecoilState, useRecoilValue } from "recoil";
import { layananState } from "@/atom/layananState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const GameLayanan: React.FC<{ games: IGame[] }> = ({ games }) => {
  const category = useRecoilValue(layananState);
  const [filteredGames, setFilteredGames] = useState<IGame[] | []>(games);
  const [limit, setLimit] = useState(9);
  const slicedGames = filteredGames.slice(0, limit);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenWidth < 600) {
      setLimit(9);
    } else if (screenWidth < 900) {
      setLimit(9);
    } else {
      setLimit(12);
    }
  }, [screenWidth]);

  const handleClickExpandGame = () => {
    if (limit > games.length) {
      setLimit(12);
    } else {
      setLimit((prevLimit) => prevLimit + 12);
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
      <div className="mt-4 md:mt-6">
        <div className="grid grid-cols-auto-xs xs:grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
          {slicedGames &&
            slicedGames.map((data) => <Game data={data} key={data.id} />)}
        </div>
      </div>
      <div className="show-more-btn w-full flex justify-center mt-4 md:mt-6 lg:mt-10">
        {limit < filteredGames.length && (
          <button
            onClick={handleClickExpandGame}
            className="flex items-center gap-2 bg-white text-sm text-primary-900 rounded-md py-2 px-4 font-medium hover:bg-primary-100"
          >
            Muat lebih banyak
            <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
          </button>
        )}
      </div>
    </>
  );
};

export default GameLayanan;
