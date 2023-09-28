"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHeart, faSmile } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/admin/Header";
import TableSocialMedia from "@/components/admin/Social Media/TableSocialMedia";
import { IPromotionPagination } from "@/interfaces/promotion";

function IconSelector() {
    const [selectedIcon, setSelectedIcon] = useState(null);

    const iconList = [
        { name: "Coffee", icon: faCoffee },
        { name: "Heart", icon: faHeart },
        { name: "Smile", icon: faSmile },
        // Tambahkan ikon lainnya di sini sesuai kebutuhan Anda
    ];

    const handleIconClick = (icon: any) => {
        setSelectedIcon(icon);
    };

    return (
        <>
            <Header title="Kode Promo" />
            <TableSocialMedia data={{} as IPromotionPagination} />
        </>
    );
}

export default IconSelector;
