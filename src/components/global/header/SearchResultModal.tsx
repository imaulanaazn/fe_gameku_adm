"use client";
import sendRequest from "@/lib/baseApi";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Game from "../game/Game";
import PopularGames from "@/components/home/PopularGames/PopularGames";
import GameListItem from "../game/GameListItem";
import Link from "next/link";

const SearchResultModal = ({
  searchKeyword,
  isModalOpen,
}: {
  searchKeyword: string;
  isModalOpen: boolean;
}) => {
  const [games, setgames] = useState<IGame[] | []>([]);

  useEffect(() => {
    const getPopularGames = async () => {
      const request = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/v1/games?isPopular=true",
        {
          method: "GET",
          credentials: "include",
          cache: "no-cache",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const res = await request.json();
      if (request.ok) {
        setgames(res);
      } else {
        setgames([]);
      }
    };

    const getSearchedGames = async () => {
      const request = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/v1/games?search=${searchKeyword}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-cache",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const res = await request.json();
      if (request.ok) {
        setgames(res);
      } else {
        setgames([]);
      }
    };

    if (searchKeyword) {
      getSearchedGames();
    } else {
      getPopularGames();
    }
  }, [searchKeyword]);

  return (
    <div
      className={`${
        isModalOpen ? "block" : "hidden"
      } absolute top-14 left-0 w-full h-auto z-50`}
    >
      <div className="result-container bg-white w-full mx-auto shadow-md rounded-lg overflow-hidden">
        <div className="result p-3 h-max">
          {!searchKeyword && (
            <h1 className="font-semibold text-sm md:text-base text-neutral-900 pb-1">
              Popular Games
            </h1>
          )}

          {searchKeyword && games.length < 1 && (
            <div className="not-found">
              <p className="text-sm">produk yang dicari tidak tersedia </p>
              <Link
                className="text-sm text-primary-900"
                href="https://api.whatsapp.com/send?phone=628112065672"
              >
                Beri kami saran produk
              </Link>
            </div>
          )}

          <h1></h1>
          <div className="max-h-96 overflow-y-auto">
            {games.map((game) => (
              <GameListItem data={game} key={game.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultModal;
