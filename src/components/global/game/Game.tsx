import React from "react";
import Image from "next/image";
import Link from "next/link";

interface IGameProps {
  data: IGame;
}

const Game: React.FC<IGameProps> = ({ data }) => {
  return (
    <Link
      key={data.id}
      href={data.slug}
      className="w-full h-full flex flex-col bg-white shadow-sm lg:shadow-md transform transition-transform hover:scale-105 rounded-lg lg:rounded-2xl hover:shadow-gray-200 overflow-hidden"
    >
      <div className="h-full w-full relative p-1 pb-2 lg:p-3">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="100"
          height="100"
          sizes="100vh"
          className="w-full rounded-lg object-cover aspect-square"
        />
        <div className="pt-2 lg:pt-3 text-center">
          <h3 className="md:font-semibold text-xs md:text-sm text-neutral-800">
            {data.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default Game;
