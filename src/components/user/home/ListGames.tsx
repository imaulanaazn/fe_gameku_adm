"use client";
import Container from "@/components/global/Container/Container";
import Game from "@/components/global/game/Game";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const ListGames: React.FC<ListGameProps> = ({ title, data }) => {
  const [limit, setLimit] = useState(9);
  const slicedGames = data.slice(0, limit);

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
    if (limit > data.length) {
      setLimit(12);
    } else {
      setLimit((prevLimit) => prevLimit + 12);
    }
  };
  return (
    <Container>
      <section className="mt-10 md:mt-12 lg:mt-20">
        <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-bold text-left">
          {title}
        </h2>
        <div className="text-center w-full">
          <div className="mt-4 md:mt-6 lg:mt-10 grid grid-cols-auto-xs xs:grid-cols-auto-sm md:grid-cols-auto-md lg:grid-cols-auto-lg gap-4 lg:gap-6">
            {slicedGames.map((game) => (
              <Game data={game} key={game.id} />
            ))}
          </div>
        </div>
        <div className="show-more-btn w-full flex justify-center mt-4 md:mt-6 lg:mt-10">
          {limit < data.length && (
            <button
              onClick={handleClickExpandGame}
              className="flex items-center gap-2 bg-darkPrimary text-sm text-primary-900 rounded-md py-2 px-4 font-medium hover:bg-primary-100"
            >
              Muat lebih banyak
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </button>
          )}
        </div>
      </section>
    </Container>
  );
};

export default ListGames;
