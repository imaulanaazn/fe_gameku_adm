"use client";
import {
  faCalendarDays,
  faClock,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFilePen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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

function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/v1/article?page=${page}&limit=6`,
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

        if (data.data.length === 0) {
          setHasMore(false); // No more articles to load
        } else {
          setArticles((prevArticles) => [...prevArticles, ...data.data]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getArticles();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      const scrollDiv = scrollableDivRef.current;
      if (scrollDiv) {
        const { scrollTop, scrollHeight, clientHeight } = scrollDiv;
        if (
          scrollHeight - scrollTop <= clientHeight + 150 &&
          hasMore &&
          !loading
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    }

    const scrollDiv = scrollableDivRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener("scroll", handleScroll);
      return () => scrollDiv.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loading]);

  async function deleteArticle(blogId: string, blogIndex: number) {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/article/${blogId}`, {
        cache: "no-cache",
        method: "DELETE",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        if (response.status === 404) toast.error("Artikel tidak ditemukan");
        throw new Error("Error fetching data");
      }

      toast.success("Berhasil menghapus blog");
      setArticles((prevArticles) => {
        const copy = [...prevArticles];
        copy.splice(blogIndex, 1);
        return copy;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleClickSearch = () => {
    // setQuery((prev) => {
    //   prev.search = prev.search.filter(
    //     (item) => item.key !== selectedOptionSearchByBefore?.key
    //   );
    //   const check = prev.search.findIndex(
    //     (item) => item.key === selectedOptionSearchBy.value
    //   );
    //   if (check !== -1) {
    //     prev.search[check].value = inputSearch;
    //   } else {
    //     prev.search.push({
    //       key: selectedOptionSearchBy.value,
    //       value: inputSearch,
    //     });
    //   }
    //   prev.page = 1;
    //   return { ...prev };
    // });
  };

  return (
    <div
      className="w-full relative h-screen overflow-y-scroll"
      ref={scrollableDivRef}
    >
      <div className="w-full py-4 bg-white sticky top-0 right-0 z-40">
        <div className="w-full px-12 mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Your Blogs</h1>
          <div className="flex items-center gap-4">
            <form id="search_form" name="gs" method="GET" action="#">
              <div className="relative md:w-max w-full">
                <input
                  type="text"
                  placeholder={"Search blog"}
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  className="peer inline-flex items-center w-full md:w-auto px-4 md:px-6 py-2 rounded-md gap-x-2 focus:bg-primary-50 text-primary-900 placeholder:text-primary-900 border-primary-900 focus:border-primary-900"
                />
                <button
                  type="button"
                  disabled={!inputSearch}
                  onClick={(e) => handleClickSearch()}
                  className="absolute top-1/2 right-1 md:right-3 -translate-y-1/2 peer-focus:bg-primary-50 h-[97%] w-auto aspect-square rounded-r-md"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-primary-900 text-lg"
                  />
                </button>
              </div>
            </form>
            <Link href="/admin/article/write">
              <div className="py-2.5 px-4 bg-primary-900 text-white rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faFilePen} className="text-sm" />
                <span>Write New Article</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full px-6 py-6">
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
          {articles.map((article, index) => (
            <div
              className="w-full mx-auto rounded-xl transform transition duration-300"
              key={index}
            >
              <div className="bg-white rounded-xl p-6 md:p-6 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-max flex-shrink-0">
                  <div className="w-full md:w-max">
                    <Image
                      src={"/images/blog-thumb-01.jpg"}
                      width={400}
                      height={300}
                      alt="blog thumbnail"
                      className="w-full md:w-32 height-auto aspect-video md:aspect-square md:rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <p className="text-xs text-primary-900 font-medium">
                    {article.categories
                      .map((category) => category.name)
                      .join(", ")}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {article.title}
                  </h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="mt-2 text-gray-600 w-full md:w-3/4">
                      {article.contentPreview}
                    </p>
                    {/* <div className="flex md:flex-col lg:flex-row shrink-0 gap-2 lg:gap-4 items-center">
                      <Image
                        src={"/images/IconUser.png"}
                        width={30}
                        height={30}
                        alt="profile"
                      />
                      <span>{article.author}</span>
                    </div> */}
                  </div>
                  <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <ul className="flex gap-x-2 text-xs text-gray-500">
                      <li>{article.author}</li>
                      <li>|</li>
                      <li>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </li>
                      <li>|</li>
                      <li>10 Comments</li>
                    </ul>
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/article/edit/${article.id}`}>
                        <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                          Edit
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                      </Link>
                      <button
                        onClick={() => {
                          deleteArticle(article.id, index);
                        }}
                      >
                        <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                          Delete
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="text-center my-4">
            <span>Loading more articles...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
