import React, { useState, ReactNode } from "react";

interface TooltipProps {
    text: string;
    children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <div className="relative inline-block group">
            {children}
            <div className="hidden group-hover:block bg-black text-white text-center p-2 rounded absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 transition duration-300 ease-in-out">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;
