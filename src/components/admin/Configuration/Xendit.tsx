"use client";

import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

interface IXenditProps {
    field: string;
    title: string;
}

const Xendit: React.FC<IXenditProps> = ({ field, title }) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [value, setValue] = useState("*************************");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClickEdit = () => {
        setIsDisabled(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <tr>
            <th scope="row" className="py-4 font-medium text-gray-900 whitespace-nowrap text-start">
                {title}
            </th>
            <th scope="row" className="py-4 font-medium text-gray-900 whitespace-nowrap text-start">
                <input
                    type="text"
                    value={value}
                    disabled={isDisabled}
                    onChange={(e) => setValue(e.target.value)}
                    ref={inputRef}
                    className={`border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500 ${
                        !isDisabled ? "border-blue-500" : "border-transparent"
                    }`}
                />
            </th>
            <th scope="row" className="py-4 font-medium text-gray-900 whitespace-nowrap text-start">
                <div
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-100 cursor-pointer rounded-full flex items-center justify-center"
                    onClick={handleClickEdit}
                >
                    <FontAwesomeIcon icon={faPencil} />
                </div>
            </th>
        </tr>
    );
};

export default Xendit;
