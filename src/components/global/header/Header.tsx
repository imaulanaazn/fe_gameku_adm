"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  faBars,
  faMagnifyingGlass,
  faScrewdriverWrench,
  faHouse,
  faCreditCard,
  faCircleDollarToSlot,
  faUser,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { userState } from "@/atom/userState";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import { toast } from "react-toastify";
import Container from "../Container/Container";

const links = [
  {
    id: 1,
    name: "Beranda",
    url: "/",
    icon: faHouse,
  },
  {
    id: 2,
    name: "Layanan",
    url: "/layanan",
    icon: faScrewdriverWrench,
  },
  {
    id: 3,
    name: "Cek transaksi",
    url: "/cek-pesanan",
    icon: faCreditCard,
  },
  {
    id: 4,
    name: "Reseller",
    url: "https://reseller.gasskeuntopup.com/",
    icon: faCircleDollarToSlot,
  },
];

const Header = () => {
  const { push } = useRouter();
  const sizeWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");
  const [width, setWidth] = useState(0);
  const [activeSideMenu, setActiveSideMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [logo, setLogo] = useRecoilState(imageAtom);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevVal) => !prevVal);
  };

  const getLogo = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
    const responseCustomer = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/logout",
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      setIsLogged(true);
    }
  }, [user]);

  return (
    <>
      <header className="relative bg-white">
        <Container>
          <div className="flex justify-between items-center gap-6 h-20">
            <div className="left-side flex items-center gap-6 xl:gap-8">
              <div className="logo">
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
              <nav className="hidden lg:block">
                <ul className="flex text-sm xl:text-base font-medium text-primary-900 flex gap-4 xl:gap-6 items-center">
                  {links.map((link) => (
                    <li
                      key={link.id}
                      className={`border-b ${
                        currentPath === link.url
                          ? "border-primary-900"
                          : "border-white"
                      } border-solid py-3`}
                    >
                      <Link href={link.url}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="right-side flex gap-6 lg:gap-2">
              <div className="search-bar w-full  relative">
                <input
                  type="text"
                  placeholder="Cari game"
                  className="w-full py-2 px-3 lg:text-sm border border-solid border-slate-400 rounded-md"
                />
                <button>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-slate-400"
                  />
                </button>
              </div>

              {/* Show profile icon when user is logged in */}
              {isLogged ? (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={handleDropdownToggle}
                  onMouseLeave={handleDropdownToggle}
                >
                  <button className="h-full rounded-full px-3 border border-slate-400 border-solid lg:ml-6">
                    <FontAwesomeIcon icon={faUser} className="" />
                  </button>
                  <div
                    className={`${
                      !isDropdownOpen && "hidden"
                    } absolute top-0 pt-14 right-0 z-10 w-max`}
                  >
                    <div className="bg-white border rounded-md shadow-lg text-slate-600 overflow-hidden">
                      <p className="px-4 py-2 text-sm cursor-default">
                        Sign in as {user.email}
                      </p>
                      <Link
                        href={"/profile"}
                        className="px-4 py-2 text-sm hover:bg-slate-200 cursor-pointer block"
                      >
                        Profile
                      </Link>
                      <p
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-200"
                        onClick={handleLogout}
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Show authentication button when user not authenticated */}
                  <button className="hidden lg:inline bg-white lg:text-sm text-primary-900 rounded-md py-2 px-4 font-semibold lg:font-medium">
                    <Link href="/login">Masuk</Link>
                  </button>
                  <button className="hidden lg:inline bg-primary-900 lg:text-sm text-white rounded-md py-2 px-4 font-semibold lg:font-medium hover:bg-black hover:text-white">
                    <Link href="/register">Daftar</Link>
                  </button>
                </>
              )}

              {/* toggle menu button only show on mobile */}
              <button
                className="lg:hidden"
                onClick={() => {
                  setActiveSideMenu((prevVal) => !prevVal);
                }}
              >
                <FontAwesomeIcon
                  icon={activeSideMenu ? faXmark : faBars}
                  className="text-2xl text-slate-900"
                />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        <div
          className={`mobile-menu ${
            !activeSideMenu && "hidden"
          } lg:hidden absolute top-20 right-0 w-10/12 md:w-1/2 h-screen bg-white z-10 text-left px-12 shadow-sm`}
        >
          <nav>
            <ul>
              {links.map((link) => (
                <li
                  key={link.id}
                  className="font-semibold text-primary-900 text-base my-8 flex gap-4 items-center"
                >
                  <FontAwesomeIcon icon={link.icon} />
                  <Link href={link.url}>{link.name}</Link>
                </li>
              ))}

              {/* Show this menu when user is logged in */}
              {isLogged && (
                <>
                  <li className="font-semibold text-primary-900 text-base my-8 flex gap-4 items-center">
                    <FontAwesomeIcon icon={faUser} />
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="font-semibold text-primary-900 text-base my-8 flex gap-4 items-center"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <Link href="/#">Logout</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Show this authentication button when user is not logged in */}
          {!isLogged && (
            <div className="auth-buttons flex gap-2 mt-6 md:hidden">
              <button className="text-primary-900 flex-1 w-full font-semibold">
                <Link href="/login">Masuk</Link>
              </button>
              <button className="bg-primary-900 text-white rounded-md py-2 flex-1 w-full font-semibold hover:bg-black hover:text-white">
                <Link href="/login">Daftar</Link>
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
