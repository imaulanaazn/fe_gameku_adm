"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";
import TableVoucherGame from "@/components/admin/Voucher Game/TableVoucherGame";

const PromoCode = () => {
    const [data, setData] = useState<IVoucherGamePagination | null>(null);
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/voucher-game?sort=gameName&order=ASC", {
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
            {!loading && data && <TableVoucherGame data={data} />}
        </>
    );
};

export default PromoCode;
