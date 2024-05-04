"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartOrderHistory: React.FC<{
  data: { date: string; totalOrders: number }[];
  day: string;
}> = ({ data, day }) => {
  const newData = data.map((item) => {
    return {
      name: item.date,
      ["Total Pesanan"]: item.totalOrders,
    };
  });
  return (
    <>
      <h1 className="mb-5 font-medium text-2xl text-neutral-800">
        Gambaran Pesanan{" "}
        <span className="text-gray-500 text-base font-normal">{day}</span>
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={300}
          data={newData}
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
            dataKey="Total Pesanan"
            stackId="1"
            stroke="#16a34a"
            fill="url(#colorPesanan)"
            strokeWidth={3}
          />
          {/* <Area
                        type="monotone"
                        dataKey="Total Pesanan Berhasil"
                        stackId="1"
                        stroke="#16a34a"
                        fill="url(#colorPesanan)"
                        strokeWidth={3}
                    />
                    <Area
                        type="monotone"
                        dataKey="Total Pesanan Gagal"
                        stackId="1"
                        stroke="#16a34a"
                        fill="url(#colorPesanan)"
                        strokeWidth={3}
                    />
                    <Area
                        type="monotone"
                        dataKey="Total Pesanan Pending"
                        stackId="1"
                        stroke="#16a34a"
                        fill="url(#colorPesanan)"
                        strokeWidth={3}
                    /> */}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartOrderHistory;
