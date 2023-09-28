"use client";

import { selectedAdminState } from "@/atom/selectedAdminState";
import { IActionBulk } from "@/interfaces/actionBulk";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

interface IActionBulkProp {
    data: IActionBulk[];
}

const ActionBulk: React.FC<IActionBulkProp> = ({ data }) => {
    const selected = useRecoilValue(selectedAdminState);

    return (
        <div className="relative inline-block text-left group">
            <button className="text-white bg-blue-700 hover:bg-blue-800 w-44 text-center py-3 flex justify-center items-center gap-3 rounded-md">
                <p className="font-semibold">Tindakan Massal</p>
                <FontAwesomeIcon icon={faAngleDown} size="sm" />
            </button>
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute z-50 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-300">
                <ul className="flex flex-col gap-1">
                    {data.map((data, i) => (
                        <li
                            key={i}
                            onClick={() => selected.length > 0 && data.onClick()}
                            className={`${
                                selected.length > 0 ? data.classActive : data.classNotAllowed
                            } px-5 py-4 rounded-lg flex gap-3 items-center select-none`}
                        >
                            <FontAwesomeIcon icon={data.icon} size="sm" />
                            <p>{data.title}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ActionBulk;
