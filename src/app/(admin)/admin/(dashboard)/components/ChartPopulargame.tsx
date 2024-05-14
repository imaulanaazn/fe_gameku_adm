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
    "#9b0d5c",
    "#690c83",
    "#32077b",
  ];
  //   for (let i = 0; i < length; i++) {
  //     const hue = (i * 360) / length;
  //     const color = `hsl(${hue}, 70%, 50%)`;
  //     colors.push(color);
  //   }
  return colors;
}

const ChartPopulargame: React.FC<{
  data: { game: string; total: number }[];
  day: string;
}> = ({ data, day }) => {
  const [dataChart, setDataChart] = useState<any[]>([]);
  const COLORS = generateColors(data.length);

  const renderLegend = (props: Props) => {
    const { payload } = props;

    return (
      <div>
        {payload &&
          payload.map((entry: any, index) => (
            <div key={index} className="flex gap-3 my-3">
              <div
                className={`w-5 h-5 rounded-full`}
                style={{ backgroundColor: entry.color }}
              ></div>
              <p>{entry?.payload?.game}</p>
            </div>
          ))}
      </div>
    );
  };

  useEffect(() => {
    const sortingData = data.sort((a, b) => b.total - a.total);
    setDataChart(sortingData.slice(0, 10));
  }, []);

  return (
    <>
      <h1 className="mb-5 font-medium text-xl md:text-2xl text-neutral-800">
        Game Popular{" "}
        <span className="text-gray-500 text-base font-normal">({day})</span>
      </h1>
      <div className="w-full py-4 overflow-x-auto">
        <ResponsiveContainer minWidth={550} width={"100%"} height={300}>
          <PieChart width={550} height={300}>
            <Pie
              data={dataChart}
              cx="50%"
              cy="50%"
              labelLine={true}
              label
              innerRadius={50}
              outerRadius={100}
              fill="#fff"
              dataKey="total"
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
      </div>
    </>
  );
};

export default ChartPopulargame;
