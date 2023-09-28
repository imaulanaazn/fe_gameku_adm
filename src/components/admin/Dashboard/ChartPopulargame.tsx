"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from "recharts";
import { Props } from "recharts/types/component/DefaultLegendContent";

const data = [
    { name: "Mobile Legend", value: 100 },
    { name: "Point Blank", value: 300 },
    { name: "Arena of Valor", value: 300 },
    { name: "Genshin Impact", value: 200 },
    { name: "Genshin Impact", value: 200 },
    { name: "Genshin Impact", value: 200 },
    { name: "Genshin Impact", value: 200 },
];

interface CustomizedLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
}

const COLORS = generateColors(data.length);

function generateColors(length: number) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const hue = (i * 360) / length;
        const color = `hsl(${hue}, 70%, 50%)`;
        colors.push(color);
    }
    return colors;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const ChartPopulargame = () => {
    const [dataChart, setDataChart] = useState<any[]>([]);

    const renderLegend = (props: Props) => {
        const { payload } = props;

        return (
            <div>
                {payload &&
                    payload.map((entry, index) => (
                        <div key={index} className="flex gap-3 my-3">
                            <div className={`w-5 h-5`} style={{ backgroundColor: entry.color }}></div>
                            <p>{entry.value}</p>
                        </div>
                    ))}
            </div>
        );
    };

    useEffect(() => {
        const sortingData = data.sort((a, b) => b.value - a.value);
        setDataChart(sortingData);
    }, []);

    return (
        <>
            <h1 className="mb-5 font-semibold text-xl">
                Game Popular <span className="text-gray-400 text-base">(30 Hari Terakhir)</span>
            </h1>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart width={300} height={300}>
                    <Pie
                        data={dataChart}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label
                        innerRadius={50}
                        outerRadius={100}
                        fill="#fff"
                        dataKey="value"
                        legendType="star"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend layout="vertical" align="left" verticalAlign="middle" content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default ChartPopulargame;
