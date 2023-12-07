"use client";

import TableBanner from "@/components/admin/Banner/TableBanner";
import Header from "@/components/admin/Header";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { useEffect, useState } from "react";
import Loading from "./loading";

const Banner = () => {
    const [banners, setBanners] = useState<IImageCarouselPagination>();
    const [loading, setLoading] = useState(true);
    const getBanners = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/banner", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setBanners({ ...banners, ...res });
        }

        setLoading(false);
    };

    useEffect(() => {
        getBanners();
    }, []);
    return (
        <>
            {loading && <Loading />}
            {!loading && <>{banners && <TableBanner banner={banners} />}</>}
        </>
    );
};

export default Banner;
