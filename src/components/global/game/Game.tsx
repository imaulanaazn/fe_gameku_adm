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
            className="flex flex-col w-24 h-44 lg:w-36 lg:h-52 bg-white shadow-lg transform transition-transform hover:scale-105 rounded-md hover:shadow-gray-600 overflow-hidden"
        >
            <div className="h-24 lg:h-36 aspect-square flex items-center">
                <Image
                    src={data.logoUrl}
                    alt={`Logo Game Gasskeun Topup ${data.name}`}
                    width="0"
                    height="0"
                    sizes="100vh"
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-lg object-cover"
                />
            </div>
            <div className="py-2 px-1">
                <div className="font-bold text-sm ">{data.name}</div>
            </div>
        </Link>
    );
};

export default Game;
