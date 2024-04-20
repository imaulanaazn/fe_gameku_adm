"use client";
import sendRequest from "@/lib/baseApi";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Game from "../game/Game";
import PopularGames from "@/components/home/PopularGames/PopularGames";

const SearchResultModal = ({
  setShowSearchModal,
  showSearchModal,
}: {
  setShowSearchModal: Dispatch<SetStateAction<boolean>>;
  showSearchModal: boolean;
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [games, setgames] = useState<IGame[] | []>([]);

  // Define the debounce function
  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      // Add type annotation for 'this'
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Debounced function for search query
  const debouncedSetSearchKeyword = debounce(setSearchKeyword, 500);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchKeyword(e.target.value);
  };

  return (
    <div
      className={`${
        !showSearchModal && "hidden"
      } fixed top-0 left-0 w-full h-screen z-20 bg-[rgba(0,0,0,0.6)]`}
      onClick={() => setShowSearchModal(false)}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 result-container bg-white w-11/12 md:w-3/4 mx-auto shadow-lg rounded-xl md:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-bar w-full relative">
          <input
            type="text"
            onChange={handleInputChange}
            placeholder="Cari game"
            className="w-full py-4 px-6 lg:py-6 lg:px-8 xl:py-4 xl:px-6 text-sm border-0 border-b-2 border-solid border-slate-400 text-lg md:text-xl focus:ring-transparent focus:border-primary-900"
          />
          <button onClick={() => setShowSearchModal(false)}>
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute bg-white p-2 top-1/2 right-6 -translate-y-1/2 text-xl text-slate-400 hover:text-primary-900"
            />
          </button>
        </div>
        <div className="result p-4 lg:p-8 h-96 md:h-[50rem] lg:h-[30rem]  overflow-y-scroll">
          {searchKeyword ? (
            <h1 className="font-semibold text-xl md:text-2xl text-neutral-900">
              Result For {searchKeyword}
            </h1>
          ) : (
            <h1 className="font-semibold text-xl md:text-2xl text-neutral-900">
              Popular Games
            </h1>
          )}
          <h1></h1>
          <div className="pt-4 md:pt-6 pb-8 md:pb-0 grid grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
            {games.map((game) => (
              <>
                <Game data={game} />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultModal;
