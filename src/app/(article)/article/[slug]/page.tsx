import sendRequest from "@/lib/baseApi";
import { ListItemSecondaryActionClassKey } from "@/lib/mui";
import {
  faFacebook,
  faFacebookF,
  faLinkedin,
  faTelegram,
  faTwitter,
  faWhatsapp,
  faWhatsappSquare,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faClock,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEnvelopeSquare,
  faShare,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import RecentPosts from "../components/RecentPosts";
import Categories from "../components/Categories";
import PopularGames from "../components/PopularGames";
import CommentSection from "./components/CommentSection";

interface IArticle {
  id: string;
  author: string;
  title: string;
  slug: string;
  content: string;
  contentPreview: string;
  status: string;
  isPopular: boolean;
  bannerImage: string;
  contentImage: string[];
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

interface IArticleDetail {
  status: number;
  ok: boolean;
  data: IArticle;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const articleRes = await sendRequest<IArticle>(`/v1/articles/${slug}`);
  const article = articleRes.data;

  const readEst = article.content.split(" ").length / 200;
  return (
    <section className="pb-12 px-4 md:px-0 pt-4 md:pt-6 lg:pt-12">
      <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
        <div className="flex flex-wrap gap-12 md:gap-0">
          <div className="w-full lg:w-2/3 px-0  md:px-4">
            <div className="space-y-8">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="pb-6">
                  <div className="flex">
                    {article.categories.map((category) => (
                      <span
                        key={category.name}
                        className="block text-base font-semibold text-primary-900"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-3xl md:text-4xl font-extrabold  text-gray-800 mt-2">
                    {article.title}
                  </h4>

                  <ul className="flex space-x-2 text-sm text-gray-500 mt-4">
                    <li>{article.author}</li>
                    <li className="text-gray-400">|</li>
                    <li className="flex items-center gap-2 text-sm lg:text-base">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="w-3 hidden md:block "
                      />
                      {dayjs(article.publishedAt).format("YY/MM/DD")}
                    </li>
                    <li className="text-gray-400">|</li>
                    <li className="flex items-center gap-2 text-sm lg:text-base">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-3 hidden md:block"
                      />
                      {Math.round(readEst)} minutes
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <Image
                    width={400}
                    height={200}
                    src={article.bannerImage}
                    alt={article.title}
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>
                <div className="p-6">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </div>

              <div className="mt-6 flex justify-between text-sm text-gray-500">
                <ul className="flex space-x-2 text-primary-900">
                  <li className="font-medium">Share Stories</li>
                </ul>
                <ul className="flex gap-2 items-center">
                  <li className="text-primary-900 flex items-center gap-2 hidden md:block">
                    <FontAwesomeIcon icon={faShareNodes} className="text-xl" />
                  </li>
                  <li className="w-8 h-8 bg-blue-600 text-white rounded-full">
                    <a
                      target="_blank"
                      href={`http://www.facebook.com/sharer/sharer.php?u=https://gasskeuntopup.com/article/${article.slug}&t=${article.title}`}
                      className="w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-green-600 text-white rounded-full">
                    <a
                      href={`whatsapp://send?text=Check out this page: https://gasskeuntopup.com/article/${article.slug}`}
                      data-action="share/whatsapp/share"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faWhatsappSquare} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-700 text-white rounded-full">
                    <a
                      target="_blank"
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=https://gasskeuntopup.com/article/${article.slug}`}
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-400 text-white rounded-full">
                    <a
                      target="_blank"
                      href={`https://t.me/share/url?url=https://gasskeuntopup.com/article/${article.slug}&title=${article.title}`}
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faTelegram} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-400 text-white rounded-full">
                    <a
                      target="_blank"
                      href={`https://twitter.com/intent/tweet?url=https://gasskeuntopup.com/article/${article.slug}&text=${article.title}`}
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-gray-400 text-white rounded-full">
                    <a
                      target="_blank"
                      href={`mailto:?subject=${article.title}&body=https://gasskeuntopup.com/article/${article.slug}`}
                      className="hover:underline w-full h-full flex items-center justify-center text-lg text-white"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  </li>
                </ul>
              </div>

              <CommentSection articleId={article.id} />
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
  );
}
