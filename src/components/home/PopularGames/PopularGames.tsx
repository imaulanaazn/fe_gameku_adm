"use client";

import Container from "@/components/global/Container/Container";
import Game from "@/components/global/game/Game";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface IPopularGamesProps {
  popularGames: IGame[];
}

const PopularGames: React.FC<IPopularGamesProps> = ({ popularGames }) => {
  const [limit, setLimit] = useState(6);
  const limitedPopularGames = popularGames.slice(0, limit);

  const handleClickExpandGame = () => {
    if (limit > popularGames.length) {
      setLimit(6);
    } else {
      setLimit((prevLimit) => prevLimit + 6);
    }
  };
  return (
    <Container className="mt-14 md:mt-16 lg:mt-24">
      <div>
        <h1 className="text-neutral-900 text-4xl lg:text-5xl font-bold text-center">
          Sedang Populer
        </h1>
        {/* <p className="text-neutral-800 lg:text-lg md:w-3/4 lg:w-2/3 mx-auto text-center mt-4">
          mainkan game terpopuler saat ini dan segera top up di gasskeun top up
        </p> */}

        <div className="mt-10 grid grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
          {limitedPopularGames.map((data) => (
            <Game data={data} key={data.id} />
          ))}
        </div>

        <div className="show-more-btn w-full flex justify-center">
          {limit < popularGames.length && (
            <button
              onClick={handleClickExpandGame}
              className="flex items-center gap-2 bg-white lg:text-sm text-primary-900 rounded-md py-2 px-4 font-semibold lg:font-medium hover:bg-primary-100"
            >
              Muat lebih banyak
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PopularGames;
