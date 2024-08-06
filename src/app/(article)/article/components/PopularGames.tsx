import sendRequest from "@/lib/baseApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default async function PopularGames() {
  const popularGamesResponse = await sendRequest<IGame[]>(
    "/v1/games?isPopular=true"
  );
  const popularGames = popularGamesResponse.data;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Promo Top Up</h2>
      </div>
      <ul className="flex flex-wrap gap-3">
        {popularGames.map((game) => (
          <Link href={`/${game.slug}`} key={game.id}>
            <li className="p-2 flex gap-2 items-center border border-slate-300 rounded text-sm font-medium text-gray-600 hover:bg-primary-100 hover:border-primary-900 hover:text-primary-900">
              <Image
                src={game.logoUrl}
                width={30}
                height={30}
                alt="game image"
                objectFit="cover"
                className="aspect-square rounded-sm"
              />

              {game.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
