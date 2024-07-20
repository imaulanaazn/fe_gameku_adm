"use client";

import Container from "@/components/global/Container/Container";
import Game from "@/components/global/game/Game";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface IPopularGamesProps {
  popularGames: IGame[];
}

const PopularGames: React.FC<IPopularGamesProps> = ({ popularGames }) => {
  const [limit, setLimit] = useState(9);
  const limitedPopularGames = popularGames.slice(0, limit);
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
    if (limit > popularGames.length) {
      setLimit(12);
    } else {
      setLimit((prevLimit) => prevLimit + 12);
    }
  };

  return (
    <Container className="mt-10 md:mt-12 lg:mt-20">
      <div>
        <h2 className="text-neutral-900 text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          🔥 Sedang Populer 🔥
        </h2>
        {/* <p className="text-neutral-800 lg:text-lg md:w-3/4 lg:w-2/3 mx-auto text-center mt-4">
          mainkan game terpopuler saat ini dan segera top up 
        </p> */}

        <div className="mt-4 md:mt-6 lg:mt-10 grid grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
          {limitedPopularGames.map((data) => (
            <>
              <Game data={data} />
            </>
          ))}
        </div>

        <div className="show-more-btn w-full flex justify-center mt-4 md:mt-6 lg:mt-10">
          {limit < popularGames.length && (
            <button
              onClick={handleClickExpandGame}
              className="flex items-center gap-2 bg-white text-sm text-primary-900 rounded-md py-2 px-4 font-medium hover:bg-primary-100"
            >
              Muat lebih banyak
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PopularGames;
