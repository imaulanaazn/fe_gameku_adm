"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { NewsVideoProps } from "@/interfaces/newsVideo";
import Container from "@/components/global/Container/Container";

const NewsVideo: React.FC<NewsVideoProps> = ({ videos }) => {
    const [videoId, setVideoId] = useState<string>("");

    useEffect(() => {
        setVideoId(videos[0].videoId);
    }, []);

    return (
        <div className="py-20 bg-black text-white mt-14 md:mt-16 lg:mt-24">
            <Container>
                <>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p className="tracking-widest text-sm">YOUTUBE CHANNEL</p>
                        <h1 className="white text-2xl lg:text-4xl font-bold lg:mt-4">News Video on this week</h1>
                        <div className="h-px bg-[#B72025] w-10"></div>
                    </div>
                    <div className="pt-20 ">
                        <div className=" max-w-4xl mx-auto ">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="w-full h-96 mx-auto"
                            ></iframe>
                            <Swiper
                                slidesPerView={3}
                                freeMode={true}
                                loop={false}
                                centeredSlides={true}
                                spaceBetween={20}
                                className="mt-10 border-b border-primary-900 border-solid"
                            >
                                {videos.map((video) => (
                                    <SwiperSlide key={video.id} onClick={() => setVideoId(video.videoId)}>
                                        <Image
                                            src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="mx-auto w-full"
                                            width="0"
                                            height="0"
                                            sizes="100vw"
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </>
            </Container>
        </div>
    );
};

export default NewsVideo;
