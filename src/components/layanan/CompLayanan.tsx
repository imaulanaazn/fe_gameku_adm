"use state";
import Container from "@/components/global/Container/Container";
import FormSearch from "./FormSearch";
import GameLayanan from "./GameLayanan";
import ListCategory from "./ListCategory";

interface ICompLayananProps {
  defaultCategory: IGameCategory[];
  gameCategories: IGameCategory[];
  games: IGame[];
}

const CompLayanan: React.FC<ICompLayananProps> = ({
  gameCategories,
  games,
  defaultCategory,
}) => {
  const filterPopular = games.filter((item) => item.isPopular);
  if (filterPopular.length === 0) {
    defaultCategory = defaultCategory.filter((item) => item.id !== "popular");
  }
  return (
    <Container className="mt-14 md:mt-16 lg:mt-24">
      <div>
        <h1 className="text-neutral-900 text-4xl lg:text-5xl font-bold text-center">
          Layanan
        </h1>
        <p className="text-neutral-800 lg:text-lg md:w-3/4 lg:w-2/3 mx-auto text-center mt-4">
          Kami menyediakan berbagai layanan untuk memenuhi segala kebutuhan
          digitalmu hanya dengan satu platform yang terintegrasi
        </p>
        <div className="mt-8 flex items-center justify-between flex-col-reverse lg:flex-row items-center sticky">
          <div className="lg:max-w-[60%] w-10/12 flex flex-nowrap lg:flex-wrap gap-3 lg:gap-4 my-4 w-full lg:w-auto overflow-x-scroll lg:overflow-x-hidden">
            {defaultCategory.map((data) => (
              <ListCategory data={data} key={data.id} />
            ))}
            {gameCategories.map((data) => (
              <ListCategory data={data} key={data.id} />
            ))}
          </div>
          <div className="w-full lg:w-2/12">
            <FormSearch />
          </div>
        </div>

        <GameLayanan games={games} />
      </div>
    </Container>
  );
};

export default CompLayanan;
