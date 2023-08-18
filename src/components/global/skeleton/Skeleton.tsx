"use client";

import React from "react";

interface ISkeletonProps {
    classes: string;
}

const Skeleton: React.FC<ISkeletonProps> = ({ classes }) => {
    return (
        <div className="animate-pulse">
            <div className={`${classes} bg-gray-300`}></div>
        </div>
    );
};

export default Skeleton;
