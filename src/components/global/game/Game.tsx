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
            className="flex flex-col w-36 h-52 bg-white shadow-lg transform transition-transform hover:scale-105 rounded-md hover:shadow-gray-600"
        >
            <div className="w-36 h-36 mx-auto rounded-md">
                <Image
                    src={data.logoUrl}
                    alt={data.name}
                    className="w-full lg:h-24 h-16 object-cover rounded-md"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <div className="py-2 px-1">
                <div className="font-bold text-sm ">{data.name}</div>
            </div>
        </Link>
    );
};

export default Game;
