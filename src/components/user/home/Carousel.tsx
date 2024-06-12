"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { IImageCarousel } from "@/interfaces/carousels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Skeleton from "@/components/global/skeleton/Skeleton";
import Image from "next/image";
import { carouselBreakpoints } from "./constants";

const Carousel = ({ slides }: { slides: IImageCarousel[] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slides || !slides.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [slides]);
  return (
    <div className="lg:py-5 px-4 md:px-0 mx-auto">
      {loading && (
        <Skeleton classes="lg:h-60 sm:h-52 h-40 lg:mx-20 mx-5 rounded-md" />
      )}
      {!loading && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={carouselBreakpoints}
          freeMode={true}
          centeredSlides={true}
          loop={slides.length > 3}
          autoplay={{
            delay: 4000,
          }}
          navigation={{ nextEl: "#next-el", prevEl: "#prev-el" }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          className="lg:max-w-screen-2xl flex items-center"
        >
          {slides &&
            slides.map((slide) => (
              <SwiperSlide
                key={slide.id}
                className="swiper-slide mx-auto flex justify-center items-center relative"
              >
                <Link
                  href={slide.eventUrl ? slide.eventUrl : "#"}
                  target={
                    slide.eventUrl && slide.eventUrl !== "#"
                      ? "_blank"
                      : "_self"
                  }
                  className="flex justify-center items-center relative"
                >
                  <div
                    className={`rounded-lg ${slides.length > 1 && "w-full"}`}
                  >
                    <Image
                      src={slide.imageUrl}
                      alt="Slide Image Banner Promo Gasskeun Topup"
                      width={395}
                      height={170}
                      priority={true}
                      objectFit="contain"
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 40vw, 27vw"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      )}

      <div className="flex justify-center items-center mt-3 md:mt-4">
        {loading && <Skeleton classes="h-3 w-52" />}
        {!loading && (
          <>
            <FontAwesomeIcon
              icon={faAngleLeft}
              size="1x"
              className="cursor-pointer px-2 text-primary-900"
              id="prev-el"
            />
            <div className="custom-pagination flex justify-center gap-2 items-center mx-2">
              {slides &&
                slides.map((slide, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faCircle}
                    size="lg"
                    className={`text-primary-900 cursor-pointer ${
                      index === 0 ? "active" : ""
                    }`}
                  />
                ))}
            </div>
            <FontAwesomeIcon
              icon={faAngleRight}
              size="1x"
              className="cursor-pointer px-2 text-primary-900"
              id="next-el"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
