import {
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faQuestionCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IAlertProps {
    type: "error" | "warning" | "info" | "success" | "question";
    message: string;
    onClose?: () => void;
}

const Alert: React.FC<IAlertProps> = ({ type, message, onClose }) => {
    let bgColorClass = "";
    let textColorClass = "";
    let icon = faInfoCircle;

    switch (type) {
        case "error":
            bgColorClass = "bg-red-50";
            textColorClass = "text-red-800";
            icon = faExclamationCircle;
            break;
        case "warning":
            bgColorClass = "bg-yellow-50";
            textColorClass = "text-yellow-800";
            icon = faExclamationTriangle;
            break;
        case "info":
            bgColorClass = "bg-blue-50";
            textColorClass = "text-blue-800";
            icon = faInfoCircle;
            break;
        case "success":
            bgColorClass = "bg-green-50";
            textColorClass = "text-green-800";
            icon = faCheckCircle;
            break;
        case "question":
            bgColorClass = "bg-gray-50";
            textColorClass = "text-gray-800";
            icon = faQuestionCircle;
            break;
        default:
            bgColorClass = "bg-gray-50";
            textColorClass = "text-gray-800";
    }

    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm rounded-lg shadow-md ${bgColorClass} ${textColorClass} text-start`}
            role="alert"
        >
            <FontAwesomeIcon icon={icon} className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" />
            <div className="flex-grow">{message}</div>
            <FontAwesomeIcon icon={faTimes} aria-label="Close" className="ml-3 cursor-pointer" onClick={onClose} />
        </div>
    );
};

export default Alert;
