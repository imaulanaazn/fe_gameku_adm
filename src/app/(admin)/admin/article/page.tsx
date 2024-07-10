"use client";
import Unauthorized from "@/components/global/401";
import { faFirstdraft } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faClock,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBoxArchive,
  faFilePen,
  faMagnifyingGlass,
  faPaperPlane,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusArticulatedEnd } from "mdi-material-ui";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import FilterSidebar from "./components/FilterSidebar";

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
  const [myData, setMyData] = useState<{ roles: string[] }>({ roles: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    isPopular: false,
    status: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAdminData = localStorage.getItem("admin");
        if (storedAdminData) {
          setMyData(JSON.parse(storedAdminData));
        } else {
          console.error("No admin data found in localStorage");
        }
      } catch (err) {
        console.error("Failed to parse admin data from localStorage", err);
      }
    }
  }, []);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAdminData = localStorage.getItem("admin");
        if (storedAdminData) {
          setMyData(JSON.parse(storedAdminData));
        } else {
          console.error("No admin data found in localStorage");
        }
      } catch (err) {
        console.error("Failed to parse admin data from localStorage", err);
      }
    }
  }, []);

  if (!myData.roles?.includes("writer") && !loading) {
    return <Unauthorized redirect={"/admin"} />;
  }

  async function deleteArticle(blogId: string, blogIndex: number) {
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
        const errResponse = await response.json();
        toast.error(errResponse.message);
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
    }
  }

  const handleClickSearch = () => {
    const queryParams = new URLSearchParams();

    if (searchFilter.isPopular) {
      queryParams.append("isPopular", searchFilter.isPopular.toString());
    }
    if (searchFilter.status) {
      queryParams.append("status", searchFilter.status);
    }
    if (searchKeyword) {
      queryParams.append("title", searchKeyword);
    }

    const fetchUrl = `${BASE_URL}/v1/article?${queryParams}`;
    const getArticleBySlug = async () => {
      try {
        setLoading(true);
        const request = await fetch(fetchUrl, {
          method: "GET",
          credentials: "include",
          cache: "no-cache",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

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
        setLoading(false);
      }
    };

    getArticleBySlug();
  };

  if (!myData.roles?.includes("writer") && !loading) {
    return <Unauthorized redirect={"/admin"} />;
  }

  return (
    <div
      className="w-full relative h-screen overflow-y-scroll"
      ref={scrollableDivRef}
    >
      <div className="w-full py-4 bg-white sticky top-0 right-0 z-40">
        <div className="w-full px-12 mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Your Blogs</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/article/write">
              <div className="py-2.5 px-4 bg-primary-900 text-white rounded-md flex items-center gap-2">
                <span>Write New Article</span>
                <FontAwesomeIcon icon={faFilePen} className="text-sm" />
              </div>
            </Link>
            <form id="search_form" name="gs" method="GET" action="#">
              <div className="relative md:w-max w-full">
                <input
                  type="text"
                  placeholder={"Search blog"}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="peer inline-flex items-center w-full md:w-auto px-4 md:px-6 py-2 rounded-md gap-x-2 focus:bg-primary-50 text-primary-900 placeholder:text-primary-900 border-primary-900 focus:border-primary-900"
                />
                <button
                  type="button"
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

            <button
              onClick={() => {
                setFilterSidebarOpen(true);
              }}
              className="filter-btn py-2.5 px-4 text-primary-900 rounded-md flex items-center gap-2 border border-primary-900"
            >
              <span>Filter</span>
              <FontAwesomeIcon icon={faSliders} className="text-sm" />
            </button>
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
                      src={article.bannerImage}
                      width={300}
                      height={300}
                      alt="blog thumbnail"
                      className="w-full md:w-32 height-auto aspect-video object-cover md:aspect-square md:rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs text-primary-900 font-medium">
                      {article.categories
                        .map((category) => category.name)
                        .join(", ")}
                    </p>
                  </div>
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
                      <li>
                        {article.status === "ARCHIVE"
                          ? "ARCHIVED"
                          : article.status === "PUBLISH"
                          ? "PUBLISHED"
                          : "DRAFT"}
                      </li>
                      {/* <li>10 Comments</li> */}
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
        <div className="text-center my-4">
          {loading && <span>Loading articles...</span>}
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 w-80 bg-white h-screen z-50 ${
          filterSidebarOpen ? "block" : "hidden"
        }`}
      >
        <FilterSidebar
          filter={searchFilter}
          closeFilterSidebar={() => setFilterSidebarOpen(false)}
          handleFilter={(filter: { isPopular: boolean; status: string }) => {
            setSearchFilter(filter);
          }}
        />
      </div>
    </div>
  );
}

export default Page;
