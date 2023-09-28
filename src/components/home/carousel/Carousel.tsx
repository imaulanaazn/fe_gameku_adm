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

const Carousel = ({ slides }: { slides: IImageCarousel[] }) => {
    const sizeWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const [width, setWidth] = useState(0);
    const [slidePerView, setSlidePerView] = useState(2);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleSlidePerView = () => {
            if (slides.length < 3) {
                setSlidePerView(slides.length);
            } else if (width > 1024) {
                setSlidePerView(2);
            } else if (width >= 768) {
                setSlidePerView(2);
            } else if (width >= 640) {
                setSlidePerView(1.5);
            } else {
                setSlidePerView(1);
            }

            setWidth(sizeWidth);
        };

        handleSlidePerView();
        window.addEventListener("resize", handleSlidePerView);
        return () => {
            window.addEventListener("resize", handleSlidePerView);
        };
    }, [sizeWidth, width]);

    useEffect(() => {
        if (!slides || !slides.length) {
            setLoading(true);
            console.log(slides);
        } else {
            setLoading(false);
        }
    }, [slides]);
    return (
        <div className="bg-black py-5 mx-auto">
            {loading && <Skeleton classes="lg:h-60 sm:h-52 h-40 lg:mx-20 mx-5 rounded-md" />}
            {!loading && (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={slidePerView}
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
                                    target={slide.eventUrl && slide.eventUrl !== "#" ? "_blank" : "_self"}
                                    className="flex justify-center items-center relative"
                                >
                                    <div
                                        className={`rounded-lg lg:h-80 md:h-60 sm:h-60 h-40 ${
                                            slides.length > 1 && "w-full"
                                        }`}
                                    >
                                        <img
                                            src={slide.imageUrl}
                                            alt="Slide Image"
                                            loading="lazy"
                                            className="h-full w-full rounded-lg"
                                        />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                </Swiper>
            )}

            <div className="flex justify-center items-center mt-5">
                {loading && <Skeleton classes="h-3 w-52" />}
                {!loading && (
                    <>
                        <FontAwesomeIcon
                            icon={faAngleLeft}
                            size="1x"
                            className="cursor-pointer px-2 text-white"
                            id="prev-el"
                        />
                        <div className="custom-pagination flex justify-center gap-2 items-center mx-2">
                            {slides &&
                                slides.map((slide, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        icon={faCircle}
                                        size="lg"
                                        className={`text-white cursor-pointer ${index === 0 ? "active" : ""}`}
                                    />
                                ))}
                        </div>
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            size="1x"
                            className="cursor-pointer px-2 text-white"
                            id="next-el"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Carousel;
