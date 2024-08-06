"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

const SearchResultModal = ({
  searchKeyword,
  isModalOpen,
}: {
  searchKeyword: string;
  isModalOpen: boolean;
}) => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getArticleBySlug = async () => {
      try {
        setIsLoading(true);
        const request = await fetch(
          `${BASE_URL}/v1/articles?title=${searchKeyword}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!request.ok) {
          throw new Error(
            "Cannot fetch articles. error status = " + request.status
          );
        }

        const res = await request.json();
        setArticles(res.data);
      } catch (error) {
        setArticles([]);
        console.error("Cannot fetch article with error : " + error);
      } finally {
        setIsLoading(false);
      }
    };

    getArticleBySlug();
  }, [searchKeyword]);

  return (
    <div
      className={`${
        isModalOpen ? "block" : "hidden"
      } fixed md:absolute top-16 md:top-14 left-0 w-full h-auto z-50`}
    >
      <div className="result-container bg-white w-full mx-auto shadow-md rounded-lg overflow-hidden">
        <div className="result p-3 h-max">
          {searchKeyword && articles.length < 1 && !isLoading && (
            <div className="not-found">
              <p className="text-sm">Artikel yang dicari tidak tersedia </p>
              <Link
                className="text-sm text-primary-900"
                href="https://api.whatsapp.com/send?phone=628112065672"
              >
                Beri kami saran artikel
              </Link>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {articles.map((article) => (
              <ArticleListItem article={article} key={article.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultModal;

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

function ArticleListItem({ article }: { article: IArticle }) {
  return (
    <div>
      <Link
        key={article.id}
        href={`/article/${article.slug}`}
        className="w-full transform transition-all rounded-lg overflow-hidden"
      >
        <div className="w-full relative flex items-center gap-3 py-1.5 hover:bg-primary-50 group">
          <Image
            src={article.bannerImage}
            alt={`Logo untuk ${article.title}`}
            width="100"
            height="50"
            className="h-12 w-auto rounded-md object-cover aspect-video"
          />
          <div>
            <h3 className="text-sm md:text-sm text-neutral-800 group-hover:text-primary-900">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="w-3 text-gray-500"
              />
              <span className="text-xs text-gray-600">
                {dayjs(article.publishedAt).format("DD-MM-YYYY")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
