"use client";

import { IconDefinition, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const DisplayTotal: React.FC<{ title: string; value: string; icon: IconDefinition; bgColorIcon: string }> = ({
    title,
    value,
    icon,
    bgColorIcon,
}) => {
    return (
        <div className="p-5 bg-white rounded-lg shadow-lg font-montserrat w-1/3">
            <div className="flex justify-between gap-2 items-center">
                <div>
                    <p className="text-gray-400 uppercase">{title}</p>
                    <p className="text-gray-400 uppercase">HARI INI</p>
                    <p className="text-xl font-semibold">{value}</p>
                </div>
                <div className={`${bgColorIcon} w-12 h-12 rounded-full text-white flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} size="xl" />
                </div>
            </div>
            <p>Description</p>
        </div>
    );
};

export default DisplayTotal;
