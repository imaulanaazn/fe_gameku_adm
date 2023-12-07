"use client";

import Header from "@/components/admin/Header";
import TablePaymentMethod from "@/components/admin/Payment Method/TablePaymentMethode";
import React, { useEffect, useState } from "react";
import Loading from "./loading";

const PaymentMethod = () => {
    const [data, setData] = useState<IPaymentMethodPagination>();
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/payment-method", {
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
            {!loading && <>{data && <TablePaymentMethod data={data} />}</>}
        </>
    );
};

export default PaymentMethod;
