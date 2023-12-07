"use client";

import Header from "@/components/admin/Header";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import { IPromotionPagination } from "@/interfaces/promotion";
import TablePromoCode from "@/components/admin/PromoCode/TablePromoCode";

const PromoCode = () => {
    const [data, setData] = useState<IPromotionPagination>();
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/promo-code", {
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
            {!loading && <>{data && <TablePromoCode data={data} />}</>}
        </>
    );
};

export default PromoCode;
