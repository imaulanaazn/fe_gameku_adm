import {
  faMagnifyingGlass,
  faMinus,
  faPlus,
  faStar,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function PopularGameModal({
  setShowPopularGamesModal,
}: {
  setShowPopularGamesModal: (toggle: boolean) => void;
}) {
  const [popularGames, setPopularGames] = useState<IGame[] | []>([]);
  const [games, setGames] = useState<IGame[] | []>([]);
  const [searchVal, setSearchVal] = useState("");
  const [gamesLimit, setGamesLimit] = useState(24);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const updatedCards = Array.from(popularGames);
      const [movedCard] = updatedCards.splice(result.source.index, 1);
      updatedCards.splice(result.destination.index, 0, movedCard);

      setPopularGames(updatedCards);
      saveCardOrder(updatedCards);
    },
    [popularGames]
  );

  const saveCardOrder = async (newOrder: IGame[]) => {
    const newPopularGames = newOrder.map((game: IGame, index) => ({
      gameId: game.id,
      order: index,
    }));

    try {
      const req = await fetch(`${BASE_URL}/v2/game/popular-bulk`, {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPopularGames),
      });

      if (!req.ok) throw new Error(`HTTP error! status: ${req.status}`);
    } catch (error) {
      toast.error("Failed to update popular game order");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const req = await fetch(`${BASE_URL}/v1/games`, {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!req.ok) throw new Error(`HTTP error! status: ${req.status}`);

        const res = await req.json();
        setGames(res);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPopularGames = async () => {
      try {
        const req = await fetch(`${BASE_URL}/v1/games?isPopular=true`);
        if (!req.ok) throw new Error(`HTTP error! status: ${req.status}`);

        const res = await req.json();
        setPopularGames(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGames();
    fetchPopularGames();
  }, []);

  const addPopularGames = useCallback(
    (game: IGame) => {
      setPopularGames((prev) => [...prev, game]);
      saveCardOrder([...popularGames, game]);
      setGames((prev) => {
        const newGameIndex = prev.findIndex(
          (prevGame) => prevGame.id === game.id
        );
        if (newGameIndex >= 0) {
          const updatedGames = [...prev];
          updatedGames[newGameIndex].isPopular = true;
          return updatedGames;
        }
        return prev;
      });
    },
    [popularGames]
  );

  const removePopularGames = useCallback(
    (game: IGame) => {
      setPopularGames((prev) =>
        prev.filter((prevGame) => prevGame.id !== game.id)
      );
      saveCardOrder(popularGames.filter((prevGame) => prevGame.id !== game.id));
      setGames((prev) => {
        const newGameIndex = prev.findIndex(
          (prevGame) => prevGame.id === game.id
        );
        if (newGameIndex >= 0) {
          const updatedGames = [...prev];
          updatedGames[newGameIndex].isPopular = false;
          return updatedGames;
        }
        return prev;
      });
    },
    [popularGames]
  );

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.name.toLowerCase().includes(searchVal.toLowerCase())
    );
  }, [games, searchVal]);

  return (
    <div className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-40 z-50 flex items-center justify-center overflow-hidden">
      <div className="h-screen md:h-auto md:max-h-full w-full md:w-11/12 lg:w-3/4 xl:w-3/5 bg-white p-6 lg:p-8 md:rounded-xl overflow-y-auto relative">
        <div className="flex justify-end items-center">
          <div
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
            onClick={() => setShowPopularGamesModal(false)}
          >
            <div className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all">
              <FontAwesomeIcon
                icon={faTimes}
                className="text-primary-900 group-hover:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-8 w-full">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="font-medium text-xl md:text-2xl text-neutral-800">
                Unpopular Games
              </h2>
              <div className="relative w-full max-w-[10rem] border border-primary-900 bg-primary-50 rounded-md overflow-hidden flex items-center">
                <input
                  placeholder={`Cari game`}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full py-2 border-none bg-transparent text-primary-900 placeholder:text-primary-900 focus:ring-transparent"
                />
                <button
                  type="button"
                  disabled={!searchVal}
                  className="pr-4 hover:cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-primary-900 text-lg"
                  />
                </button>
              </div>
            </div>

            <div className="h-[85vh] md:h-[60vh] lg:h-[70vh] overflow-y-auto mt-4 max-w-96">
              {filteredGames.length > 0 || searchVal
                ? filteredGames.slice(0, gamesLimit).map(
                    (game: IGame) =>
                      !game.isPopular && (
                        <div
                          className="p-4 my-3 bg-primary-50 flex gap-4 items-center justify-between rounded-lg"
                          key={game.id}
                        >
                          <div className="flex gap-4 items-center">
                            <Image
                              src={game.logoUrl}
                              width={40}
                              height={40}
                              quality={60}
                              loading="lazy"
                              alt={game.name + "image"}
                              className="rounded-md"
                            />
                            <p>{game.name}</p>
                          </div>

                          <button
                            onClick={() => {
                              addPopularGames(game);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={farStar}
                              className="text-primary-900 text-lg"
                            />
                          </button>
                        </div>
                      )
                  )
                : games.map(
                    (game: IGame) =>
                      !game.isPopular && (
                        <div
                          className="p-4 my-3 bg-primary-50 flex gap-4 items-center justify-between rounded-lg"
                          key={game.id}
                        >
                          <div className="flex gap-4 items-center">
                            <Image
                              src={game.logoUrl}
                              width={40}
                              height={40}
                              quality={60}
                              loading="lazy"
                              alt={game.name + "image"}
                              className="rounded-md"
                            />
                            <p>{game.name}</p>
                          </div>

                          <button
                            onClick={() => {
                              addPopularGames(game);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={farStar}
                              className="text-primary-900 text-lg"
                            />
                          </button>
                        </div>
                      )
                  )}
              {gamesLimit < games.length && (
                <div className="flex justify-center mt-4">
                  <button
                    className="py-3 px-4 bg-primary-900 mx-auto rounded-md text-white"
                    type="button"
                    onClick={() => {
                      setGamesLimit(games.length);
                    }}
                  >
                    Tampilkan semua
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="font-medium text-xl md:text-2xl text-neutral-800">
              Popular Games
            </h2>
            <div className="h-[85vh] md:h-[60vh] lg:h-[70vh] overflow-y-auto mt-4">
              {popularGames.length > 0 && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="pr-2"
                      >
                        {popularGames.map((game: IGame, index) => (
                          <Draggable
                            key={game.id}
                            draggableId={game.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="select-none py-4 px-5 my-3 flex gap-4 items-center justify-between rounded-lg bg-primary-50"
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div className="flex gap-4 items-center">
                                  <Image
                                    src={game.logoUrl}
                                    width={40}
                                    height={40}
                                    quality={60}
                                    loading="lazy"
                                    alt={game.name + "image"}
                                    className="rounded-md"
                                  />
                                  <p>{game.name}</p>
                                </div>

                                <button
                                  onClick={() => {
                                    removePopularGames(game);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-primary-900 text-lg"
                                  />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
