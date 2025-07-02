"use client";
import Container from "@/components/global/Container/Container";
import FormSearch from "./FormSearch";
import GameLayanan from "./GameLayanan";
import ListCategory from "./ListCategory";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

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
      <Container className="sticky top-[4.5rem] z-40 mt-4 md:mt-6 pb-2.5">
        <Swiper
          modules={[Navigation]}
          slidesPerView={"auto"}
          freeMode={true}
          spaceBetween={8}
        >
          {defaultCategory.concat(gameCategories).map((data) => (
            <SwiperSlide key={data.id} className="category">
              <ListCategory data={data} key={data.id} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
      <Container>
        <GameLayanan games={games} />
      </Container>
    </>
  );
};

export default CompLayanan;
