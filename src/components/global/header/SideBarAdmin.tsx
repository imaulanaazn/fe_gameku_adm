"use client";

import {
  faArrowLeft,
  faArrowRight,
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
  faRightFromBracket,
  faSortNumericUpAlt,
  faTicket,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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
  const [showFullSidebar, setShowFullSidebar] = useState(true);
  const [data, setData] = useState<any>();

  const [logo, setLogo] = useRecoilState(imageAtom);

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
    const toastId = toast.loading("Proses Logout...");
    const responseCustomer = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/admin/logout",
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
    <div
      className={`w-full fixed top-0 left-0 z-50 lg:static ${
        showFullSidebar
          ? "max-w-[16rem] translate-x-0"
          : "max-w-[6rem] -translate-x-full lg:translate-x-0"
      } flex flex-col items-center bg-white gap-3 overflow-x-visible h-screen transition-all duration-700`}
    >
      {/* close button */}
      <div className="sidebar-header w-full bg-white border-b border-slate-200 relative">
        <div
          onClick={() => {
            setShowFullSidebar((prev) => !prev);
          }}
          className={`text-white w-7 h-7 flex items-center justify-center rounded-full bg-primary-900 
          text-base absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-50 hover:cursor-pointer transition-all duration-700
          ${
            showFullSidebar
              ? "translate-x-1/2"
              : "translate-x-12 lg:translate-x-1/2"
          }
          `}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className={`transition-all duration-700 ${
              !showFullSidebar ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        <Link href={"/"} className="logo w-full flex items-center gap-2 p-4">
          <div className="aspect-square rounded-lg w-10 shrink-0">
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
          <h6
            className={`text-lg font-semibold whitespace-nowrap scale-1 opacity-1 duration-700 ${
              !showFullSidebar && "scale-0 opacity-0 -translate-x-full"
            }`}
          >
            Gasskeun Topup
          </h6>
        </Link>
      </div>
      <div className="w-full px-4 overflow-y-auto">
        {MENU.map(
          (menu, i) =>
            ((menu.link === "/admin/admin" && showMenuAdmin) ||
              menu.link !== "/admin/admin") && (
              <Link
                key={i}
                href={menu.link}
                className={`${
                  currentPath === menu.link
                    ? "bg-primary-900"
                    : "bg-transparent hover:bg-primary-100"
                } w-full py-3 px-4 rounded-md flex gap-4 items-center group duration-500`}
              >
                <div
                  className={`icon text-base transition-all duration-500 ${
                    currentPath === menu.link
                      ? "text-white"
                      : "text-neutral-500 group-hover:text-primary-900"
                  }`}
                >
                  <FontAwesomeIcon icon={menu.icon} />
                </div>

                <p
                  className={`font-base text-base transition-all duration-500 whitespace-nowrap ${
                    !showFullSidebar && "scale-0 opacity-0 -translate-x-full"
                  } ${
                    currentPath === menu.link
                      ? "text-white"
                      : "text-neutral-500 group-hover:text-primary-900"
                  }`}
                >
                  {menu.name}
                </p>
              </Link>
            )
        )}

        <div className="border-t border-gray-200 w-full">
          <div
            onClick={handleLogout}
            className={`bg-transparent hover:bg-primary-100 w-full py-3 px-4 rounded-md flex gap-4 items-center group duration-500 hover:cursor-pointer`}
          >
            <div
              className={`icon text-base transition-all duration-500 text-neutral-500 group-hover:text-primary-900`}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>

            <p
              className={`font-base text-base transition-all duration-500 whitespace-nowrap ${
                !showFullSidebar && "scale-0 opacity-0 -translate-x-full"
              } text-neutral-500 group-hover:text-primary-900`}
            >
              Logout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarAdmin;
