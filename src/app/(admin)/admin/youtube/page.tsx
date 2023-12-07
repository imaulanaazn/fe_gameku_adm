"use client";

import { useEffect, useState } from "react";
import Header from "@/components/admin/Header";
import TableYoutubeVideo from "@/components/admin/Youtube Video/TableYoutubeVideo";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { INewsVideosPagination } from "@/interfaces/newsVideo";
import Loading from "./loading";

const Youtube = () => {
    const [data, setData] = useState<INewsVideosPagination | null>(null);
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/youtube", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setData({ ...data, ...res });
        }

        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            {loading && <Loading />}
            {!loading && <>{data && <TableYoutubeVideo data={data} />}</>}
        </>
    );
};

export default Youtube;
