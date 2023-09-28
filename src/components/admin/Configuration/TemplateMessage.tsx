"use client";

import * as iconBrands from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";

interface TemplateMessageProps {
    data: ITemplateMessage[];
}

const TemplateMessage: React.FC<TemplateMessageProps> = ({ data }) => {
    // const [hover, setHover] = useState(false);

    // const handleHover = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    //     console.log(e);
    //     setHover(e.type === "mouseenter");
    // };

    const [hoverStates, setHoverStates] = useState<boolean[]>(Array(data.length).fill(false));

    const handleHover = (index: number, isEnter: boolean) => {
        setHoverStates((prev) => {
            const duplicate = [...prev];
            duplicate[index] = isEnter;
            return duplicate;
        });
    };

    const handlePreview = (label: string) => {
        console.log(label);
    };

    useEffect(() => {
        console.log(hoverStates[4]);
    }, [hoverStates]);

    useEffect(() => {
        for (const iconBrand in iconBrands) {
            console.log(iconBrand);
        }
    }, []);

    return (
        <>
            <div className="w-full mt-5 p-5 bg-white rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold mb-4">Template Pesan Whatsapp</h1>
                <div className="flex w-full flex-wrap">
                    {data.map((data, index) => (
                        <div
                            key={data.value}
                            className="w-1/4 px-2 select-none"
                            onMouseEnter={() => handleHover(index, true)}
                            onMouseLeave={() => handleHover(index, false)}
                        >
                            <div className="border-2 rounded-md shadow-md p-4 mb-4 aspect-square overflow-hidden w-full relative">
                                {hoverStates[index] && (
                                    <div className="bg-gray-800 absolute w-full top-0 left-0 h-full bg-opacity-50">
                                        <div className="flex justify-center items-center w-full h-full space-x-3">
                                            <button
                                                onClick={() => handlePreview(data.value)}
                                                className="px-4 py-2 bg-green-400 rounded-md hover:bg-green-200 shadow shadow-gray-400"
                                            >
                                                View
                                            </button>
                                            <button className="px-4 py-2 bg-green-400 rounded-md hover:bg-green-200 shadow shadow-gray-400">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 truncate">{data.label}</h2>
                                    <p className="text-gray-700 whitespace-normal">{data.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TemplateMessage;
