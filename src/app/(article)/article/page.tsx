import { faCalendarDays, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlogCarousel from "./components/BlogCarousel";
import sendRequest from "@/lib/baseApi";
import dayjs from "dayjs";
import RecentPosts from "./components/RecentPosts";
import Categories from "./components/Categories";
import PopularGames from "./components/PopularGames";
import Link from "next/link";

interface IListArticleResponse {
  data: IArticle[];
  page: number;
  total: number;
  totalPage: number;
  order: string;
  sort: string;
  limit: number;
}

interface IArticle {
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

export default async function Article() {
  const articleResponse = await sendRequest<IListArticleResponse>(
    "/v1/articles?page=1&limit=12"
  );
  const articles = articleResponse.data.data;

  return (
    <>
      <BlogCarousel />

      <section className="bg-gray-50 py-12 px-4 md:px-0">
        <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
          <div className="text-center">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-[url('/images/cta-bg.jpg')] py-12 md:py-10 lg:py-12 px-8 xl:px-12">
              <div className="w-full md:w-2/3">
                <p className="text-base font-medium text-white text-center lg:text-left">
                  GASSKEUN TOP UP
                </p>
                <h4 className="text-2xl font-bold text-white text-center lg:text-left mt-2">
                  Tempat top up beragam games dan produk lainnya!
                </h4>
              </div>
              <div className="w-full lg:w-1/3 text-center lg:text-right">
                <Link
                  href="/"
                  className="inline-block px-6 py-2 bg-primary-900 text-white font-medium"
                >
                  Top Up Sekarang!!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 px-4 md:px-0">
        <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-2/3 px-4">
              <div className="space-y-8">
                <div className="flex flex-wrap -mx-4">
                  {articles?.map((article) => (
                    <div key={article.id} className="w-full md:w-1/2 px-4 mb-8">
                      <div className="mb-6 hover:brightness-75 transition-all">
                        <Link href={`/article/${article.slug}`}>
                          <Image
                            src={article.bannerImage}
                            width={400}
                            height={400}
                            alt="blog post"
                            className="w-full h-auto aspect-video object-cover"
                          />
                        </Link>
                      </div>
                      <div>
                        <div className="flex gap-4">
                          {article.categories.map((category) => (
                            <span
                              key={category.name}
                              className="block text-base font-semibold text-primary-900"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                        <Link href={`/article/${article.slug}`}>
                          <div className="block text-lg font-bold text-gray-800 hover:underline mt-2">
                            {article.title}
                          </div>
                        </Link>
                        <ul className="flex space-x-2 text-sm text-gray-500 mt-2">
                          <li>{article.author}</li>
                          <li className="text-gray-400">|</li>
                          <li className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="w-3"
                            />
                            {dayjs(article.publishedAt).format("DD-MM-YYYY")}
                          </li>
                          {/* <li className="text-gray-400">|</li>
                          <li className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="w-3" />
                            12 minutes
                          </li> */}
                        </ul>
                        <p className="text-sm text-gray-600 my-5">
                          {article.contentPreview}
                        </p>
                        {/* <div className="mt-4">
                          <ul className="flex space-x-2 text-sm text-gray-500">
                            <li>12 comments</li>
                          </ul>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 px-4 md:px-0 lg:pl-8">
              <div className="space-y-8">
                <RecentPosts />
                {/* <Categories /> */}
                <PopularGames />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
