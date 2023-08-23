"use state";

import FormSearch from "./FormSearch";
import GameLayanan from "./GameLayanan";
import ListCategory from "./ListCategory";

interface ICompLayananProps {
    defaultCategory: IGameCategory[];
    gameCategories: IGameCategory[];
    games: IGame[];
}

const CompLayanan: React.FC<ICompLayananProps> = ({ gameCategories, games, defaultCategory }) => {
    return (
        <>
            <FormSearch />
            <div className="flex gap-3 mt-3">
                {defaultCategory.map((data) => (
                    <ListCategory data={data} key={data.id} />
                ))}
                {gameCategories.map((data) => (
                    <ListCategory data={data} key={data.id} />
                ))}
            </div>

            <GameLayanan games={games} />
        </>
    );
};

export default CompLayanan;
