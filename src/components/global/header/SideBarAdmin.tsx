"use client";

import {
    faCogs,
    faContactCard,
    faCreditCard,
    faCube,
    faDoorOpen,
    faFlag,
    faGamepad,
    faGlobeAsia,
    faHistory,
    faHome,
    faImage,
    faSortNumericUpAlt,
    faTicket,
    faTrash,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";

const MENU = [
    {
        name: "Admin",
        icon: faHome,
        link: "/admin/admin",
    },
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
        name: "Reseller",
        icon: faDiagramProject,
        link: "/admin/reseller",
    },
    {
        name: "Game",
        icon: faGamepad,
        link: "/admin/game",
    },
    {
        name: "Denom",
        icon: faCube,
        link: "/admin/denom",
    },
    // {
    //     name: "Kategori Denom",
    //     icon: faCube,
    //     link: "/admin/product-category",
    // },
    {
        name: "Voucher Game",
        icon: faGamepad,
        link: "/admin/game-voucher",
    },
    {
        name: "Metode Pembayaran",
        icon: faCreditCard,
        link: "/admin/payment-method",
    },
    // {
    //     name: "Postingan",
    //     icon: faGlobeAsia,
    //     link: "/admin/posts",
    // },
    {
        name: "Media Sosial",
        icon: faContactCard,
        link: "/admin/social-media",
    },
    {
        name: "Youtube Video",
        icon: faYoutube,
        link: "/admin/youtube",
    },
    {
        name: "Riwayat Pesanan",
        icon: faHistory,
        link: "/admin/orders",
    },
    {
        name: "Riwayat Deposit",
        icon: faHistory,
        link: "/admin/deposit-history",
    },
];
const SideBarAdmin = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState("");
    const [showMenuAdmin, setShowMenuAdmin] = useState(false);
    const [data, setData] = useState<any>();

    const [logo, setLogo] = useRecoilState(imageAtom);

    const getLogo = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo", {
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setLogo((prev) => ({
                ...prev,
                logo: res[0].value,
            }));
        }
    };

    const handleLogout = async () => {
        const toastId = toast.loading("Proses Logout...");
        const responseCustomer = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/admin/logout", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (responseCustomer.ok) {
            toast.update(toastId, {
                render: "Berhasil Logout",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            localStorage.setItem("auth-admin", JSON.stringify({ login: false }));
            localStorage.removeItem("admin");
            router.push("/admin/auth/login");
        } else {
            const res = await responseCustomer.json();
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => {
            const data = JSON.parse(localStorage.getItem("admin") as any);
            setShowMenuAdmin(data?.roleName === "super-admin");
            setData(data);
        }, 1000);

        if (!logo.logo) {
            getLogo();
        }
    }, []);

    return (
        <div className="w-full max-w-[16rem] font-montserrat flex flex-col items-center bg-gray-100 p-4 gap-3 overflow-y-scroll h-screen">
            <div className="flex gap-5 items-center w-full my-5 flex-col">
                <div className="aspect-square rounded-lg w-40">
                    {logo.logo && (
                        <Image
                            src={logo.logo}
                            alt="Logo Gasskeun Topup"
                            className="rounded-lg object-contain"
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: "100%", height: "100%" }}
                        />
                    )}
                </div>
                <div className="w-40">
                    <h1 className=" text-lg font-semibold">Hallo, {data?.name || "Admin"}</h1>
                </div>
            </div>
            <div>
                {MENU.map(
                    (menu, i) =>
                        ((menu.link === "/admin/admin" && showMenuAdmin) || menu.link !== "/admin/admin") && (
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
                        ),
                )}
            </div>
            <div className="border-t-2 border-gray-400 w-full">
                <div
                    onClick={handleLogout}
                    className={`mt-4 w-full cursor-pointer p-2 rounded-lg flex gap-3 items-center hover:bg-gray-300 border-2 shadow-lg shadow-gray-300`}
                >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center shadow-md bg-gray-100`}>
                        <FontAwesomeIcon icon={faDoorOpen} size="1x" />
                    </div>
                    <p className="font-semibold text-sm">Logout</p>
                </div>
            </div>
        </div>
    );
};

export default SideBarAdmin;
