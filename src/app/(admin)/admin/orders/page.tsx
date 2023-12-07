"use client";

import TableOrders from "@/components/admin/Orders/TableOrders";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "./loading";
import { useEffect, useState } from "react";

const Orders = () => {
    const [data, setData] = useState<IOrderWithAnalitycsPaginationWithDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/orders", {
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
            {!loading && data && <TableOrders data={data} />}
        </>
    );
};

export default Orders;
