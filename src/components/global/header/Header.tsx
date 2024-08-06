"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
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
import SearchResultModal from "./SearchResultModal";
import { links } from "./constants";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [logo, setLogo] = useRecoilState(imageAtom);

  const getUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/me`,
        {
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevVal) => !prevVal);
  };

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Debounced function for search query
  const debouncedSetSearchKeyword = debounce(setSearchKeyword, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchKeyword(e.target.value);
  };

  const handleFocus = () => {
    setIsModalOpen(true);
  };

  // Function to close the dropdown
  const handleBlur = (e: { relatedTarget: Node | null }) => {
    if (
      modalContainerRef.current &&
      !modalContainerRef.current.contains(e.relatedTarget)
    ) {
      setIsModalOpen(false);
    }
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
    getUser();

    if (!logo.logo) {
      getLogo();
    }
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      setIsLogged(true);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-white">
        <Container>
          <div className="flex justify-between items-center gap-4 md:gap-6 h-[4.5rem]">
            <div className="left-side flex items-center gap-6 xl:gap-8">
              <div className="logo">
                <Link href="/" className="flex items-center w-12 h-12">
                  {logo && logo.logo && (
                    <Image
                      src={logo.logo}
                      alt="Logo Gasskeun Topup"
                      width="0"
                      height="0"
                      sizes="10vw"
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
                      className={`border-b-2 ${
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

            <div className="right-side flex gap-6 lg:gap-4 relative items-center">
              <div
                className="search-bar w-full relative"
                ref={modalContainerRef}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <input
                  type="text"
                  onChange={handleSearchChange}
                  placeholder="Cari game"
                  className="peer py-2 px-4 border border-solid text-primary-900 rounded-md w-full md:w-80 lg:w-60 xl:w-80 text-start border-primary-900 focus:border-primary-900 focus:border-2"
                />
                <button>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute top-1/2 right-6 -translate-y-1/2 text-lg text-primary-900"
                  />
                </button>

                <SearchResultModal
                  searchKeyword={searchKeyword}
                  isModalOpen={isModalOpen}
                />
              </div>

              {/* Show profile icon when user is logged in */}
              {isLogged ? (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={handleDropdownToggle}
                  onMouseLeave={handleDropdownToggle}
                >
                  <button className="h-full w-auto rounded-full aspect-square">
                    <Image
                      src={user.image || "/images/user-fallback.png"}
                      alt="user profile"
                      width={50}
                      height={50}
                      objectFit="cover"
                    />
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
                type="button"
                className="lg:hidden"
                name="menu toggler"
                onClick={() => {
                  setActiveSideMenu((prevVal) => !prevVal);
                }}
              >
                <FontAwesomeIcon
                  icon={activeSideMenu ? faXmark : faBars}
                  className="text-2xl text-primary-900"
                />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        <div
          className={`mobile-menu ${
            !activeSideMenu && "translate-x-full opacity-0"
          } lg:hidden absolute translate-x-0 opacity-100 top-18 right-0 w-10/12 md:w-1/2 h-screen bg-white z-10 text-left px-12 shadow-sm transition-all duration-400`}
        >
          <nav>
            <ul>
              {links.map((link) => (
                <li
                  key={link.id}
                  onClick={() => {
                    setActiveSideMenu((prevVal) => !prevVal);
                  }}
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
                <Link href="/register">Daftar</Link>
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
