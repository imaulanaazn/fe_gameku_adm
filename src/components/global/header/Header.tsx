"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faUserAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import SideMenu from "./SideMenu";
import Image from "next/image";
import { userState } from "@/atom/userState";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import { toast } from "react-toastify";

const links = [
    {
        id: 1,
        name: "HOME",
        url: "/",
    },
    {
        id: 2,
        name: "LAYANAN",
        url: "/layanan",
    },
    {
        id: 3,
        name: "CEK PESANAN",
        url: "/cek-pesanan",
    },
];

const Header = () => {
    const { push } = useRouter();
    const sizeWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState("");
    const [width, setWidth] = useState(0);
    const [activeSideMenu, setActiveSideMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useRecoilState(userState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [logo, setLogo] = useRecoilState(imageAtom);

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
        const toastId = toast.loading("Memproses logout...");
        const responseCustomer = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/logout", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (responseCustomer.ok) {
            setUser({} as IUser);
            localStorage.setItem("auth", JSON.stringify({ login: false }));
            localStorage.removeItem("user");
            setIsLogged(false);
            toast.update(toastId, {
                render: "Berhasil logout",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            push("/login");
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
        const handleWidth = () => {
            setWidth(sizeWidth);
        };

        handleWidth();
        window.addEventListener("resize", handleWidth);
        return () => {
            window.addEventListener("resize", handleWidth);
        };
    }, [sizeWidth, width]);

    useEffect(() => {
        if (!logo.logo) {
            getLogo();
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (Object.keys(user).length) {
            setIsLogged(true);
        }
    }, [user]);
    return (
        <header
            className={`${
                isScrolled ? "shadow-md transition-shadow shadow-slate-500 " : ""
            } ease-in-out sticky top-0 z-40 bg-[#B72025] box-border text-sm duration-500`}
        >
            {activeSideMenu && (
                <SideMenu
                    onClose={() => setActiveSideMenu(!activeSideMenu)}
                    currentPath={currentPath}
                    logo={logo.logo}
                />
            )}
            <div className="container mx-auto flex justify-between sm:p-4 p-4 items-center">
                <div className="flex items-center gap-2">
                    {width <= 1024 && (
                        <FontAwesomeIcon
                            icon={faBars}
                            size="2xl"
                            className="text-white mr-2 cursor-pointer"
                            onClick={() => setActiveSideMenu(!activeSideMenu)}
                        />
                    )}
                    <Link href="/" className="flex items-center w-12 h-12">
                        {logo && logo.logo && (
                            <Image
                                src={logo.logo}
                                alt="Logo Gasskeun Topup"
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="object-contain"
                            />
                        )}
                    </Link>
                </div>
                <div className="flex items-center font-pulse font-bold">
                    {width > 1024 && (
                        <>
                            {links.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    className={`mx-4 p-2 ${styles.nav_link} ${
                                        currentPath === link.url ? styles.nav_active : ""
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-10 bg-white w-px border-2"></div>
                        </>
                    )}
                    {isLogged ? (
                        <div
                            className="flex justify-center items-center px-4 relative cursor-pointer"
                            onMouseEnter={handleDropdownToggle}
                            onMouseLeave={handleDropdownToggle}
                        >
                            <div className="bg-white m-2 rounded-full flex justify-center items-center overflow-hidden">
                                <FontAwesomeIcon icon={faUserAlt} size="xl" className="text-[#BCBDBF]" />
                            </div>
                            <p className="text-white">Profile</p>
                            {isDropdownOpen && (
                                <div className="absolute top-8 right-0 mt-2 bg-white border rounded shadow-lg">
                                    <p className="px-4 py-2 cursor-default">Sign in as us {user.email}</p>
                                    <Link
                                        href={"/profile"}
                                        className="px-4 py-2 hover:bg-slate-400 cursor-pointer block"
                                    >
                                        Profile
                                    </Link>
                                    <p className="px-4 py-2 cursor-pointer hover:bg-slate-400" onClick={handleLogout}>
                                        Logout
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="flex justify-center items-center mx-4">
                            <div className="bg-white m-2 rounded-full flex justify-center items-center overflow-hidden">
                                <FontAwesomeIcon icon={faUserAlt} size="xl" className="text-[#BCBDBF]" />
                            </div>
                            <p className="text-white">MASUK</p>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
