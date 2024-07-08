import sendRequest from "@/lib/baseApi";
import { faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
export default async function RecentPosts() {
  const articleResponse = await sendRequest<IListArticleResponse>(
    "/v1/articles?page=1&limit=5"
  );
  const articles = articleResponse.data.data;

  return (
    <div className="">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Artikel Terbaru</h2>
      </div>
      <ul className="flex flex-col gap-4">
        {articles.map((article) => (
          <Link href={`/article/${article.slug}`} key={article.id}>
            <li>
              <h5 className="text-base font-semibold text-gray-700">
                {article.title}
              </h5>
              <ul className="flex space-x-2 text-xs text-gray-500 mt-2">
                <li>{article.author}</li>
                <li className="text-gray-400">|</li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} className="w-3" />
                  {dayjs(article.publishedAt).format("DD-MM-YYYY")}
                </li>
                {/* <li className="text-gray-400">|</li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-3" />
                  12 minutes
                </li> */}
              </ul>

              <div className="divider w-full h-px bg-slate-300 mt-4"></div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
