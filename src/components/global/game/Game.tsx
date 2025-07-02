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
      className="w-full shadow-sm lg:shadow-md transform transition-transform hover:scale-105 rounded-xl lg:rounded-2xl hover:shadow-gray-200 overflow-hidden"
    >
      <div className="w-full h-full relative">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="100"
          height="100"
          quality={30}
          sizes="(max-width: 768px) 20vw, (max-width: 1200px) 24vw, 20vw"
          loading="lazy"
          className="w-full h-full aspect-[1/1.5] rounded-md object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center p-2.5 backdrop-blur-md">
          <h3 className="md:font-semibold text-xs md:text-sm text-neutral-900 text-center text-white">
            {data.name.length > 16 ? data.name.slice(0, 16) + ".." : data.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default Game;
