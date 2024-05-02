"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Props } from "recharts/types/component/DefaultLegendContent";

function generateColors(length: number) {
  const colors = [
    "#3C0919",
    "#7D1128",
    "#FF2C55",
    "#F5D0C5",
    "#707078",
    "#7D8570",
    "#000000",
  ];
  //   for (let i = 0; i < length; i++) {
  //     const hue = (i * 360) / length;
  //     const color = `hsl(${hue}, 70%, 50%)`;
  //     colors.push(color);
  //   }
  return colors;
}

const ChartPopulargame: React.FC<{
  data: { name: string; value: number }[];
}> = ({ data }) => {
  const [dataChart, setDataChart] = useState<any[]>([]);
  const COLORS = generateColors(data.length);

  const renderLegend = (props: Props) => {
    const { payload } = props;

    return (
      <div>
        {payload &&
          payload.map((entry, index) => (
            <div key={index} className="flex gap-3 my-3">
              <div
                className={`w-5 h-5 rounded-full`}
                style={{ backgroundColor: entry.color }}
              ></div>
              <p>{entry.value}</p>
            </div>
          ))}
      </div>
    );
  };

  useEffect(() => {
    const sortingData = data.sort((a, b) => b.value - a.value);
    setDataChart(sortingData.slice(0, 10));
  }, []);

  return (
    <>
      <h1 className="mb-5 font-medium text-2xl text-neutral-800">
        Game Popular{" "}
        <span className="text-gray-500 text-base font-normal">
          (30 Hari Terakhir)
        </span>
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="left"
            verticalAlign="middle"
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartPopulargame;
