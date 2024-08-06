"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";

import { Pagination, Autoplay } from "swiper/modules";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Article {
  id: string;
  author: string;
  title: string;
  slug: string;
  contentPreview: string;
  status: string;
  isPopular: boolean;
  bannerImage: string;
  buttons: {
    name: string;
    url: string;
  }[];
  categories: {
    name: string;
    slug: string;
  }[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const carouselBreakpoints = {
  0: {
    slidesPerView: 1,
  },
  640: {
    slidesPerView: 1.25,
  },
  768: {
    slidesPerView: 1.5,
  },
  1024: {
    slidesPerView: 2.5,
  },
  1280: {
    slidesPerView: 3,
  },
};

export default function BlogCarousel() {
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/v1/articles?page=1&limit=12&isPopular=true`,
          {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();

        setPopularArticles(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getArticles();
  }, []);

  return (
    <section className="px-4 md:px-0">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={28}
        slidesPerView={1}
        centeredSlides={true}
        freeMode={true}
        loop={popularArticles.length > 3}
        autoplay={{
          delay: 4000,
        }}
        breakpoints={carouselBreakpoints}
        className="flex items-center"
      >
        {popularArticles.map((article) => (
          <SwiperSlide key={article.id}>
            <Link href={`/article/${article.slug}`}>
              <div className="bg-white shadow-md overflow-hidden relative group">
                <Image
                  src={article.bannerImage}
                  alt={article.title}
                  width={200}
                  height={150}
                  className="w-full h-auto aspect-video object-cover"
                />
                <div className="p-6 pt-20 group-hover:pt-28 absolute bottom-0 left-0 bg-gradient-to-t from-slate-900 to-[rgba(0,0,0,0)] w-full transition-all">
                  <div className="text-sm font-medium text-white flex gap-4">
                    <span className="text-white">
                      {article.categories
                        .map((category) => category.name)
                        .join(", ")}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">
                    {article.title}
                  </h4>

                  <ul className="flex space-x-4 text-sm text-white mt-4">
                    <li>{article.author}</li>
                    <li>|</li>
                    <li>{dayjs(article.publishedAt).format("DD-MM-YYYY")}</li>
                    {/* <li>|</li>
                    <li>12 Comments</li> */}
                  </ul>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
