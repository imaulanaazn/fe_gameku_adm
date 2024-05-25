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
      className="w-full transform transition-all rounded-lg overflow-hidden"
    >
      <div className="w-full relative flex items-center gap-3 py-1.5 hover:bg-primary-50 group">
        <Image
          src={data.logoUrl}
          alt={`Logo Game Gasskeun Topup ${data.name}`}
          width="10"
          height="10"
          sizes="5vh"
          className="h-10 w-auto rounded-md object-cover aspect-square"
        />
        <h3 className="text-xs md:text-sm text-neutral-800 group-hover:text-primary-900">
          {data.name}
        </h3>
      </div>
    </Link>
  );
};

export default GameListItem;
