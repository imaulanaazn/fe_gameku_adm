import React from "react";
import Image from "next/image";
import Link from "next/link";

interface IGameProps {
  data: IGame;
}

const GameHorizontal: React.FC<IGameProps> = ({ data }) => {
  return (
    <Link
      key={data.id}
      href={data.slug}
      className="w-full h-full flex items-center flex-col bg-orange-400/90 shadow-sm lg:shadow-md transform transition-transform hover:scale-105 rounded-lg lg:rounded-2xl hover:shadow-gray-200 overflow-hidden p-2 lg:p-3"
    >
      <div className="w-full h-full flex gap-2 relative">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="100"
          height="100"
          quality={50}
          sizes="(max-width: 768px) 20vw, (max-width: 1200px) 28vw, 22vw"
          loading="lazy"
          className="w-12 aspect-square rounded-lg object-cover aspect-square"
        />

        <h3 className="self-center text-left font-semibold text-xs md:text-sm text-white">
          {data.name}
        </h3>
      </div>
    </Link>
  );
};

export default GameHorizontal;
