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
      <div className="mt-10 md:mt-12 lg:mt-20" id="layanan">
        <h2 className="text-neutral-900 text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          Layanan
        </h2>
        <p className="text-neutral-800 text-sm md:text-base lg:text-lg md:w-3/4 lg:w-1/2 mx-auto text-center mt-4">
          Top up game, voucher, pulsa, e-wallet dan berbagai kebutuhan lainnya
          dengan beragam metode pembayaran
        </p>
      </div>
      <Container className="sticky top-[4.5rem] z-40 bg-[rgba(255,255,255,0.2)] backdrop-blur-3xl">
        <div className="mt-6 lg:mt-8 flex items-center justify-between flex-col-reverse lg:flex-row items-center">
          <div className="w-full flex flex-no-wrap lg:flex-wrap gap-3 lg:gap-3 overflow-x-scroll lg:overflow-x-hidden py-2 md:py-3">
            {defaultCategory.map((data) => (
              <ListCategory data={data} key={data.id} />
            ))}
            {gameCategories.map((data) => (
              <ListCategory data={data} key={data.id} />
            ))}
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
