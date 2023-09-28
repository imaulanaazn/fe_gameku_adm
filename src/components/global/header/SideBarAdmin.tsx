"use client";

import {
    faCogs,
    faCreditCard,
    faCube,
    faFlag,
    faGamepad,
    faGlobeAsia,
    faHistory,
    faHome,
    faImage,
    faTicket,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MENU = [
    {
        name: "Dashboard",
        icon: faHome,
        link: "/admin",
    },
    {
        name: "Konfigurasi",
        icon: faCogs,
        link: "/admin/configuration",
    },
    {
        name: "Banner",
        icon: faImage,
        link: "/admin/banner",
    },
    {
        name: "Kode Promo",
        icon: faTicket,
        link: "/admin/promo-code",
    },
    {
        name: "User",
        icon: faUser,
        link: "/admin/user",
    },
    {
        name: "Game",
        icon: faGamepad,
        link: "/admin/game",
    },
    {
        name: "Voucher Game",
        icon: faGamepad,
        link: "/admin/game-voucher",
    },
    {
        name: "Denom",
        icon: faCube,
        link: "/admin/denom",
    },
    {
        name: "Metode Pembayaran",
        icon: faCreditCard,
        link: "/admin/payment-method",
    },
    {
        name: "Postingan",
        icon: faGlobeAsia,
        link: "/admin/posts",
    },
    {
        name: "Media Sosial",
        icon: faGlobeAsia,
        link: "/admin/social-media",
    },
    {
        name: "Riwayat Pesanan",
        icon: faHistory,
        link: "/admin/orders",
    },
];
const SideBarAdmin = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState("");

    const toggleSwitch = () => {
        setIsEnabled(!isEnabled);
    };

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    return (
        <div className="w-full max-w-[18rem] font-montserrat flex flex-col items-center bg-gray-100 p-4 gap-3 overflow-y-scroll ansolute left-0 top-0 h-screen">
            <div className="flex gap-5 items-center w-full my-5">
                <div className="w-20 h-20 rounded-lg object-cover ">
                    <Image
                        src="/images/logo_gasskeun.jpg"
                        alt="Logo Gasskeun Topup"
                        className="rounded-lg"
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
                <div>
                    <h1 className="text-xl font-semibold">Hallo, Admin</h1>
                </div>
            </div>
            <div className="w-full">
                {MENU.map((menu, i) => (
                    <Link
                        key={i}
                        href={menu.link}
                        className={`${
                            currentPath === menu.link ? "bg-white shadow-lg shadow-gray-300" : "bg-transparent"
                        } w-full p-2 rounded-lg flex gap-3 items-center hover:bg-gray-300`}
                    >
                        <div
                            className={`${
                                currentPath === menu.link ? "bg-[#B72025] text-white" : "bg-white"
                            } w-10 h-10 rounded-md flex items-center justify-center shadow-md`}
                        >
                            <FontAwesomeIcon icon={menu.icon} size="1x" />
                        </div>
                        <p className="font-semibold text-sm">{menu.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SideBarAdmin;
