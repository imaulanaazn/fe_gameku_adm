"use client";
import Container from "@/components/global/Container/Container";
import Game from "@/components/global/game/Game";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ListGames: React.FC<ListGameProps> = ({ title, data }) => {
  const [limit, setLimit] = useState(24);
  const slicedGames = data.slice(0, limit);

  const handleClickExpandGame = () => {
    if (limit > data.length) {
      setLimit(24);
    } else {
      setLimit((prevLimit) => prevLimit + 24);
    }
  };
  return (
    <Container>
      <section className="mt-16 lg:mt-24">
        <h2 className="text-center text-neutral-900 text-2xl lg:text-4xl font-bold">
          {title}
        </h2>
        <div className="pb-8 text-center w-full">
          <div className="mt-10 grid grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-3 lg:gap-6">
            {slicedGames.map((game) => (
              <Game data={game} key={game.id} />
            ))}
          </div>
        </div>
        {limit < data.length && (
          <button
            onClick={handleClickExpandGame}
            className="mx-auto flex items-center gap-2 bg-white lg:text-sm text-primary-900 rounded-md py-2 px-4 font-semibold lg:font-medium hover:bg-primary-100"
          >
            Muat lebih banyak
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        )}
      </section>
    </Container>
  );
};

export default ListGames;
