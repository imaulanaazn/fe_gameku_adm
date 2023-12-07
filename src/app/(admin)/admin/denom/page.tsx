"use client";

import TableDenom from "@/components/admin/Denom/TableDenom";
import Header from "@/components/admin/Header";
import { useEffect, useState } from "react";
import Loading from "./loading";

const Denom = () => {
    const [denoms, setDenoms] = useState<IProductPagination>();
    const [loading, setLoading] = useState(true);
    const getDenoms = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setDenoms({ ...denoms, ...res });
        }

        setLoading(false);
    };

    useEffect(() => {
        getDenoms();
    }, []);

    return (
        <>
            {loading && <Loading />}
            {!loading && <>{denoms && <TableDenom denom={denoms} />}</>}
        </>
    );
};

export default Denom;
