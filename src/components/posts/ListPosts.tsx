"use client";

import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
dayjs.extend(relativeTime);

const ListPosts: React.FC<{ blogs: { data: INewsPost[]; totalData: number }; limit: number }> = ({ blogs, limit }) => {
    const [articles, setArticles] = useState(blogs.data);
    const [page, setPage] = useState(2);
    const [isEnd, setIsEnd] = useState(false);

    const getArticles = async () => {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/newest-articles?limit=${limit}&page=${page}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        const res = await request.json();
        if (request.ok) {
            setArticles([...articles, ...res.data]);
        }
    };
    const handleMoreArticles = () => {
        getArticles();
        setPage(page + 1);
    };

    useEffect(() => {
        const displayTotalData = (page - 1) * limit;
        if (displayTotalData >= blogs.totalData) {
            setIsEnd(true);
        }
    }, [page]);

    return (
        <>
            {articles.map((blog) => (
                <Link
                    href={!blog.isExternal ? "/posts/" + blog.slug : blog.externalUrl ? blog.externalUrl : "#"}
                    key={blog.id}
                    className="flex w-full h-60 bg-white shadow-md mt-5 p-5 gap-10 hover:bg-slate-200 rounded-md"
                >
                    <div className=" w-1/4">
                        <Image
                            src={blog.img}
                            alt="Logo Jokiku gasskeun"
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: "100%", height: "100%" }}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-between w-3/4">
                        <h1 className="text-3xl font-semibold">{blog.title}</h1>
                        <div>
                            <p className="text-gray-500 font-montserrat font-semibold mb-2 text-xs">
                                {dayjs(blog.publishDate).format("DD-MM-YYYY")} -
                                <span> {dayjs(blog.publishDate).fromNow()}</span>
                            </p>
                            <p className="text-gray-500 font-montserrat font-semibold mb-2 text-xs">
                                <FontAwesomeIcon icon={faCommentAlt} size="xs" className="text-[#B72025] mr-1" />
                                {blog.totalComments} Komentar
                            </p>
                            <div className="mb-5 py-3 sm:px-10 px-4 rounded-md text-xs text-white font-montserrat font-bold bg-[#B72025] inline-block w-fit">
                                READ MORE
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {!isEnd && (
                <div
                    onClick={handleMoreArticles}
                    className="text-[#B72025] font-pulse font-bold hover:text-[#d46b6f] cursor-pointer text-center mt-5"
                >
                    Tampilkan lebih banyak
                </div>
            )}
        </>
    );
};

export default ListPosts;
