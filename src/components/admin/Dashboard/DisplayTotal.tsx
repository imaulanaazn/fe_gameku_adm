"use client";

import formatter from "@/lib/formatter";
import {
  IconDefinition,
  faArrowTrendDown,
  faArrowTrendUp,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const DisplayTotal: React.FC<{
  title: string;
  total: number;
  percentageChange: number;
  icon: IconDefinition;
  color: { border: string; background: string; icon: string };
  countPercent?: boolean;
  classes?: string;
  day?: string;
  isCurrency?: boolean;
}> = ({
  title,
  total,
  percentageChange,
  icon,
  color,
  countPercent,
  classes,
  day,
  isCurrency,
}) => {
  let iconTrend: any;
  let colorTrend: string;
  if (percentageChange && percentageChange < 0) {
    iconTrend = faArrowTrendDown;
    colorTrend = "text-red-600";
  } else if (percentageChange && percentageChange > 0) {
    iconTrend = faArrowTrendUp;
    colorTrend = "text-green-600";
  } else {
    colorTrend = "text-gray-600";
    iconTrend = faInfoCircle;
  }

  if (title === "Pesanan Gagal") {
    if (percentageChange && percentageChange < 0) {
      iconTrend = faArrowTrendUp;
      colorTrend = "text-green-600";
    } else if (percentageChange && percentageChange > 0) {
      iconTrend = faArrowTrendDown;
      colorTrend = "text-red-600";
    } else {
      colorTrend = "text-gray-600";
      iconTrend = faInfoCircle;
    }
  }

  return (
    <div
      className={`p-5 rounded-lg shadow-sm w-full h-full transition ease-in-out flex item-center justify-center ${
        classes ? classes : "bg-white"
      }`}
    >
      <div className="flex gap-6 items-center justify-center">
        <div
          className={`white ${color.icon} w-16 h-16 rounded-full flex items-center justify-center border-2 border-solid ${color.border} ${color.background} shrink-0`}
        >
          <FontAwesomeIcon icon={icon} size="xl" />
        </div>
        <div>
          <p className="text-gray-500 mb-2">
            {title} {day && day}
          </p>
          <p className="text-2xl font-semibold">
            {isCurrency ? formatter(total) : total}
          </p>
          {countPercent && (
            <div
              className={`flex gap-2 mt-2 items-center ${
                percentageChange
                  ? percentageChange < 0
                    ? "text-red-600"
                    : "text-green-600"
                  : "text-gray-600"
              } font-semibold`}
            >
              <FontAwesomeIcon icon={iconTrend} />
              <p className="text-xs">
                {percentageChange ? percentageChange : 0}% dari kemarin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayTotal;
