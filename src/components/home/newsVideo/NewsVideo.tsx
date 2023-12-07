"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { NewsVideoProps } from "@/interfaces/newsVideo";

const NewsVideo: React.FC<NewsVideoProps> = ({ videos }) => {
    const [videoId, setVideoId] = useState<string>("");

    useEffect(() => {
        setVideoId(videos[0].videoId);
    }, []);

    return (
        <div className="py-20 bg-black text-white">
            <div className="container mx-auto sm:px-0 px-5">
                <div className="flex flex-col items-center gap-3 text-center">
                    <p className="font-montserrat font-light text-xs tracking-widest">YOUTUBE CHANNEL</p>
                    <h1 className="font-pulse font-semibold text-3xl">News Video on this week</h1>
                    <div className="h-px bg-[#B72025] w-10"></div>
                </div>
                <div className="py-20 ">
                    <div className=" max-w-4xl mx-auto ">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-96 mx-auto shadow-lg shadow-slate-600"
                        ></iframe>
                        <Swiper
                            slidesPerView={3}
                            freeMode={true}
                            loop={false}
                            centeredSlides={true}
                            spaceBetween={20}
                            className="mt-10 shadow-md shadow-slate-600"
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
            </div>
        </div>
    );
};

export default NewsVideo;
