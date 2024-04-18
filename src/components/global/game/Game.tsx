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
      className="flex flex-col bg-white shadow-lg transform transition-transform hover:scale-105 rounded-md hover:shadow-gray-200 overflow-hidden"
    >
      <div className="h-36 lg:h-44 xl:lg:h-48 aspect-square flex items-center relative">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="0"
          height="0"
          sizes="100vh"
          style={{ width: "100%", height: "100%" }}
          className="rounded-lg object-cover"
        />
        <div className="w-full py-2 px-2 lg:py-3 lg:px-3 absolute bottom-0 left-0">
          <div className="w-full py-2 px-2 bg-white rounded-md">
            <p className="font-semibold text-sm text-neutral-700">
              {data.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Game;
