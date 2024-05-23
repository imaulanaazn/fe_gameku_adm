import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function PopularGameModal({
  setShowPopularGamesModal,
}: {
  setShowPopularGamesModal: (toggle: boolean) => void;
}) {
  const [popularGames, setPopularGames] = useState<IGame[] | []>([]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const updatedCards = Array.from(popularGames);
    const [movedCard] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, movedCard);

    setPopularGames(updatedCards);
    saveCardOrder(updatedCards);
  };

  const saveCardOrder = async (newOrder: IGame[]) => {
    const newPopularGames = newOrder.map((game: IGame, index: number) => ({
      gameId: game.id,
      order: index,
    }));

    try {
      const req = await fetch(BASE_URL + "/v2/game/popular-bulk", {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPopularGames),
      });

      if (!req.ok) {
        throw new Error(`HTTP error! status: ${req.status}`);
      }

      toast.success("Berhasil mengubah urutan popular game");
    } catch (error) {
      toast.success("Gagal mengubah urutan popular game");
      console.error(error);
    }
  };

  useEffect(() => {
    async function getPopularGames() {
      try {
        const req = await fetch(`${BASE_URL}/v1/games?isPopular=true`);
        const res = await req.json();
        setPopularGames(res);
      } catch (error) {
        console.error(error);
      }
    }

    getPopularGames();
  }, []);

  return (
    <div className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-40 z-50 flex items-center justify-center overflow-hidden">
      <div className="h-screen md:h-auto md:max-h-full w-full md:w-max bg-white p-6 lg:p-8 md:rounded-xl overflow-hidden relative">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
            Popular Games
          </h1>
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
                            className="select-none py-4 px-5 my-2 bg-primary-50 flex gap-4 items-center rounded-lg"
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Image
                              src={game.logoUrl}
                              width={50}
                              height={50}
                              quality={60}
                              loading="lazy"
                              alt={game.name + "image"}
                              className="rounded-md"
                            />
                            <p>{game.name}</p>
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
  );
}
