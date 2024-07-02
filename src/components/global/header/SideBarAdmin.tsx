"use client";

import {
  faArrowLeft,
  faCogs,
  faContactCard,
  faCreditCard,
  faCube,
  faGamepad,
  faHistory,
  faHome,
  faImage,
  faRightFromBracket,
  faPenToSquare,
  faTicket,
  faUser,
  faUsersGear,
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

export const adminMenu = [
  {
    title: "Admin",
    path: "/admin",
    icon: faUsersGear,
    quote: "temukan ringkasan bisnismu disini",
  },
  {
    title: "Artikel",
    path: "/article",
    icon: faPenToSquare,
    quote: "temukan ringkasan bisnismu disini",
  },
  {
    title: "Banner",
    path: "/banner",
    icon: faImage,
    quote: "buat banner untuk menarik lebih banyak pelanggan",
  },
  {
    title: "Dashboard",
    path: "",
    icon: faHome,
    quote: "temukan ringkasan bisnismu disini",
  },
  {
    title: "Denom",
    path: "/denom",
    icon: faCube,
    quote: "kelola item produkmu disini",
  },
  {
    title: "Game",
    path: "/game",
    icon: faGamepad,
    quote: "kelola segala jenis produkmu disini",
  },
  {
    title: "Kode Promo",
    path: "/promo-code",
    icon: faTicket,
    quote: "kelola kebutuhan kode promo layananmu disini",
  },
  {
    title: "Konfigurasi",
    path: "/configuration",
    icon: faCogs,
    quote: "kelola website kamu sesuai kebutuhanmu",
  },
  {
    title: "Media Sosial",
    path: "/social-media",
    icon: faContactCard,
    quote: "kelola social media agar pelanggan lebih mengenalmu",
  },
  {
    title: "Metode Pembayaran",
    path: "/payment-method",
    icon: faCreditCard,
    quote: "kelola bagaimana pembayaran produkmu dilakukan",
  },
  {
    title: "Reseller",
    path: "/reseller",
    icon: faDiagramProject,
    quote: "pantau informasi mengenai reseller disini",
  },
  {
    title: "Riwayat Deposit",
    path: "/deposit-history",
    icon: faHistory,
    quote: "pantau riwayat deposit pelangganmu disini",
  },
  {
    title: "Riwayat Pesanan",
    path: "/order",
    icon: faHistory,
    quote: "pantau riwayat pesanan pelangganmu disini",
  },
  {
    title: "User",
    path: "/user",
    icon: faUser,
    quote: "pantau informasi mengenai pelangganmu disini",
  },
  {
    title: "Voucher Game",
    path: "/game-voucher",
    icon: faGamepad,
    quote: "buat voucher untuk menarik lebih banyak pelanggan",
  },
  {
    title: "Youtube Video",
    path: "/youtube",
    icon: faYoutube,
    quote: "buat video menarik agar bisa mendapatkan perhatian pelanggan",
  },
];

async function fetchAdminMenu() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/admin-menu`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch admin menu:", error);
    return null;
  }
}

export default function SideBarAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const [showFullSidebar, setShowFullSidebar] = useState(true);
  const [logo, setLogo] = useRecoilState(imageAtom);
  const [sidebarMenuItems, setSidebarMenuItems] = useState([]);

  useEffect(() => {
    async function getMenuItems() {
      const menuItems = await fetchAdminMenu();
      if (menuItems.length > 0) {
        const menuItemsTemp = menuItems.map(
          (item: { path: string; title: string }) => ({
            path: item.path === "/" ? "/admin" : "/admin" + item.path,
            title: item.title,
          })
        );
        setSidebarMenuItems(menuItemsTemp);
      }
    }

    getMenuItems();
    getLogo();
  }, []);

  const getLogo = async () => {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/config?type=logo`,
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/admin/logout`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (response.ok) {
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
      const res = await response.json();
      toast.update(toastId, {
        render: res.message,
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 z-50 lg:static ${
        showFullSidebar
          ? "max-w-[16rem] translate-x-0"
          : "max-w-[6rem] -translate-x-full lg:translate-x-0"
      } flex flex-col items-center bg-white gap-3 overflow-x-visible h-screen transition-all duration-700`}
    >
      <div className="sidebar-header w-full bg-white border-b border-slate-200 relative">
        <div
          onClick={() => setShowFullSidebar((prev) => !prev)}
          className={`text-white w-7 h-7 flex items-center justify-center rounded-full bg-primary-900 
          text-base absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-50 hover:cursor-pointer transition-all duration-700
          ${
            showFullSidebar
              ? "translate-x-1/2"
              : "translate-x-12 lg:translate-x-1/2"
          }`}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className={`transition-all duration-700 ${
              !showFullSidebar ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        <Link href="/" className="logo w-full flex items-center gap-2 p-4">
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
        {sidebarMenuItems.map(
          (menuItem: { path: string; title: string }, i) => (
            <Link
              key={i}
              href={menuItem.path}
              className={`${
                pathname === menuItem.path
                  ? "bg-primary-900"
                  : "bg-transparent hover:bg-primary-100"
              } w-full py-3 px-4 rounded-md flex gap-4 items-center group duration-500`}
            >
              <div
                className={`icon text-base transition-all duration-500 ${
                  pathname === menuItem.path
                    ? "text-white"
                    : "text-neutral-500 group-hover:text-primary-900"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    adminMenu.find(
                      (menu) => "/admin" + menu.path === menuItem.path
                    )?.icon!
                  }
                />
              </div>

              <p
                className={`font-base text-base transition-all duration-500 whitespace-nowrap ${
                  !showFullSidebar && "scale-0 opacity-0 -translate-x-full"
                } ${
                  pathname === menuItem.path
                    ? "text-white"
                    : "text-neutral-500 group-hover:text-primary-900"
                }`}
              >
                {menuItem.title}
              </p>
            </Link>
          )
        )}

        <div className="border-t border-gray-200 w-full">
          <div
            onClick={handleLogout}
            className="bg-transparent hover:bg-primary-100 w-full py-3 px-4 rounded-md flex gap-4 items-center group duration-500 hover:cursor-pointer"
          >
            <div className="icon text-base transition-all duration-500 text-neutral-500 group-hover:text-primary-900">
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
}
