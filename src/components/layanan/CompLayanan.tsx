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
    const filterPopular = games.filter((item) => item.isPopular);
    if (filterPopular.length === 0) {
        defaultCategory = defaultCategory.filter((item) => item.id !== "popular");
    }
    return (
        <>
            <FormSearch />
            <div className="flex gap-3 mt-3 w-full overflow-x-scroll sm:overflow-x-auto">
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
