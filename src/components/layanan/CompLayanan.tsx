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
    <>
      <div className="mt-14 md:mt-16 lg:mt-24" id="layanan">
        <h1 className="text-neutral-900 text-4xl lg:text-5xl font-bold text-center">
          Layanan
        </h1>
        <p className="text-neutral-800 lg:text-lg md:w-3/4 lg:w-2/3 mx-auto text-center mt-4">
          Kami menyediakan berbagai layanan untuk memenuhi segala kebutuhan
          digitalmu hanya dengan satu platform yang terintegrasi
        </p>
      </div>
      <Container className="sticky top-20 z-40 bg-[rgba(255,255,255,0.2)] backdrop-blur-3xl my-4">
        <div className="mt-8 py-1 md:py-2 flex items-center justify-between flex-col-reverse lg:flex-row items-center">
          <div className="lg:max-w-[60%] w-full lg:w-auto flex flex-nowrap lg:flex-wrap gap-3 lg:gap-4 mb-3 md:my-3 overflow-x-scroll lg:overflow-x-hidden">
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
      </Container>
      <Container>
        <GameLayanan games={games} />
      </Container>
    </>
  );
};

export default CompLayanan;
