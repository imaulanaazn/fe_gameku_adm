import React from "react";
import Image from "next/image";
import Link from "next/link";

interface IGameProps {
  data: IGame;
}

const GameListItem: React.FC<IGameProps> = ({ data }) => {
  return (
    <Link
      key={data.id}
      href={`/${data.slug}`}
      className="w-full bg-white transform transition-all hover:bg-slate-100 rounded-lg overflow-hidden"
    >
      <div className="w-full relative flex items-center gap-2 p-1">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="10"
          height="10"
          sizes="60vh"
          className="h-10 w-auto rounded-lg object-cover aspect-square"
        />
        <h3 className="text-xs md:text-sm text-neutral-800">{data.name}</h3>
      </div>
    </Link>
  );
};

export default GameListItem;
