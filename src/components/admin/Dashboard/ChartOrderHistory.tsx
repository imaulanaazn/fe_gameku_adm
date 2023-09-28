"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DATA_FROM_API = {
    totalOrders7daysBefore: 1200,
    totalOrdersLastWeek: 1425,
    lastWeek: [
        {
            date: "01 Agustus",
            total: 150,
        },
        {
            date: "02 Agustus",
            total: 150,
        },
        {
            date: "03 Agustus",
            total: 150,
        },
        {
            date: "04 Agustus",
            total: 150,
        },
        {
            date: "05 Agustus",
            total: 150,
        },
        {
            date: "06 Agustus",
            total: 150,
        },
        {
            date: "07 Agustus",
            total: 150,
        },
        {
            date: "08 Agustus",
            total: 150,
        },
        {
            date: "09 Agustus",
            total: 25,
        },
        {
            date: "10 Agustus",
            total: 150,
        },
        {
            date: "11 Agustus",
            total: 150,
        },
        {
            date: "12 Agustus",
            total: 150,
        },
        {
            date: "13 Agustus",
            total: 150,
        },
        {
            date: "14 Agustus",
            total: 40,
        },
        {
            date: "15 Agustus",
            total: 150,
        },
        {
            date: "16 Agustus",
            total: 150,
        },
        {
            date: "17 Agustus",
            total: 150,
        },
        {
            date: "18 Agustus",
            total: 150,
        },
        {
            date: "19 Agustus",
            total: 200,
        },
        {
            date: "20 Agustus",
            total: 150,
        },
        {
            date: "21 Agustus",
            total: 123,
        },
        {
            date: "22 Agustus",
            total: 500,
        },
        {
            date: "23 Agustus",
            total: 150,
        },
        {
            date: "24 Agustus",
            total: 150,
        },
        {
            date: "25 Agustus",
            total: 150,
        },
        {
            date: "26 Agustus",
            total: 150,
        },
        {
            date: "27 Agustus",
            total: 150,
        },
        {
            date: "28 Agustus",
            total: 300,
        },
        {
            date: "29 Agustus",
            total: 50,
        },
        {
            date: "30 Agustus",
            total: 2,
        },
        {
            date: "31 Agustus",
            total: 123,
        },
        {
            date: "01 September",
            total: 300,
        },
        {
            date: "02 September",
            total: 500,
        },
    ],
};

const ChartOrderHistory = () => {
    const [percentage, setPercentage] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const getDataLastWeek = () => {};

    useEffect(() => {
        const percent =
            (((DATA_FROM_API.totalOrdersLastWeek - DATA_FROM_API.totalOrders7daysBefore) /
                DATA_FROM_API.totalOrders7daysBefore) *
                100) /
            100;
        console.log(percent);
    }, []);

    // Development only
    useEffect(() => {
        const newData = DATA_FROM_API.lastWeek.map((data) => ({
            name: data.date,
            Pesanan: data.total,
        }));
        setData(newData);
    }, []);
    return (
        <>
            <h1 className="mb-5 font-semibold text-xl">
                Gambaran Pesanan <span className="text-gray-400 text-base">(30 Hari Terakhir)</span>
            </h1>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: -12,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPesanan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#bbf7d0" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#bbf7d0" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" strokeOpacity={0} />
                    <YAxis strokeOpacity={0} />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="Pesanan"
                        stackId="1"
                        stroke="#16a34a"
                        fill="url(#colorPesanan)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default ChartOrderHistory;
