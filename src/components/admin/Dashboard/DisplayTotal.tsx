"use client";

import formatter from "@/lib/formatter";
import { IconDefinition, faArrowTrendDown, faArrowTrendUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const DisplayTotal: React.FC<{
    title: string;
    value: number;
    valueBefore: number;
    icon: IconDefinition;
    bgColorIcon: string;
    countPercent?: boolean;
    classes?: string;
    day?: string;
    isCurrency?: boolean;
}> = ({ title, value, valueBefore, icon, bgColorIcon, countPercent, classes, day, isCurrency }) => {
    const result = ((value - valueBefore) / valueBefore) * 100;
    let percent = valueBefore === 0 ? value * 100 : Math.round(result * 100) / 100;

    let iconTrend: any;
    let colorTrend: string;
    if (percent && percent < 0) {
        iconTrend = faArrowTrendDown;
        colorTrend = "text-red-600";
    } else if (percent && percent > 0) {
        iconTrend = faArrowTrendUp;
        colorTrend = "text-green-600";
    } else {
        colorTrend = "text-gray-600";
        iconTrend = faInfoCircle;
    }

    if (title === "Pesanan Gagal") {
        if (percent && percent < 0) {
            iconTrend = faArrowTrendUp;
            colorTrend = "text-green-600";
        } else if (percent && percent > 0) {
            iconTrend = faArrowTrendDown;
            colorTrend = "text-red-600";
        } else {
            colorTrend = "text-gray-600";
            iconTrend = faInfoCircle;
        }
    }

    return (
        <div
            className={`p-5 rounded-lg shadow-lg font-montserrat w-full transition ease-in-out ${
                classes ? classes : "bg-white"
            }`}
        >
            <div className="flex justify-between gap-2 items-center">
                <div>
                    <p className="text-gray-400 uppercase text-sm">{title}</p>
                    {day && <p className="text-gray-400 uppercase text-sm">{day.toUpperCase()}</p>}
                    <p className="text-xl font-semibold">{isCurrency ? formatter(value) : value}</p>
                </div>
                <div className={`${bgColorIcon} w-12 h-12 rounded-full text-white flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} size="xl" />
                </div>
            </div>
            {countPercent && (
                <div
                    className={`flex gap-2 mt-2 items-center ${
                        percent ? (percent < 0 ? "text-red-600" : "text-green-600") : "text-gray-600"
                    } font-semibold`}
                >
                    <FontAwesomeIcon icon={iconTrend} />
                    <p className="text-xs">{percent ? percent : 0}% dari kemarin</p>
                </div>
            )}
        </div>
    );
};

export default DisplayTotal;
