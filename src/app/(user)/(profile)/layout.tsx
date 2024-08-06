"use client";
import Container from "@/components/global/Container/Container";
import {
  faClockRotateLeft,
  faCoins,
  faEdit,
  faFilterCircleDollar,
  faRightFromBracket,
  faShapes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userState";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const sidebarMenus = [
  {
    name: "Dashboard",
    path: "/profile",
    icon: faShapes,
  },
  {
    name: "Deposit",
    path: "/profile/deposit",
    icon: faCoins,
  },
  {
    name: "Profile",
    path: "/profile/settings",
    icon: faUser,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const inputFile = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const currentPath = usePathname();

  const handleLogout = async () => {
    const toastId = toast.loading("Memproses logout...");
    setLoading(true);
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
    setLoading(false);
  };

  const uploadImage = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/image?id=" + user.id,
      {
        cache: "no-cache",
        method: "PUT",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      }
    );

    const res = await req.json();
    if (req.ok) {
      setUser((prev) => ({
        ...prev,
        ...res,
      }));

      localStorage.setItem("user", JSON.stringify({ ...user, ...res }));
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleClick = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  return (
    <Container className="w-full flex gap-8 pt-10 pb-12">
      <div className="sidebard w-3/12 bg-white rounded-lg hidden lg:block">
        <div className="bg-white rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div
              className="h-20 md:h-28 lg:h-14 aspect-square rounded-full bg-opacity-50 flex-shrink-0 relative group border-2 border-gray-400 lg:border-white"
              onClick={handleClick}
            >
              <Image
                src={user.image || "/images/user-fallback.png"}
                width={140}
                height={140}
                alt="user profile"
                className="w-full h-full"
              />
              <div className="hidden group-hover:flex cursor-pointer bg-opacity-30 absolute top-0 left-0 bg-black w-full h-full z-50 aspect-square rounded-full justify-center items-center">
                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 text-white">
                  <FontAwesomeIcon icon={faEdit} className="text-xl" />
                </span>
                <input
                  className=""
                  type="file"
                  name="imageLogoDenom"
                  id="imageLogoDenom"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  ref={inputFile}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <h1 className="text-xl font-bold mt-4">{user.name}</h1>
            <p className="text-gray-700">{user.email}</p>
            <Link
              href="/profile/settings"
              className="text-primary-900 underline px-6 py-2 rounded-full cursor-pointer text-sm font-medium flex gap-2 items-center"
            >
              Edit Profile
              <FontAwesomeIcon icon={faEdit} />
            </Link>
          </div>
        </div>

        <div className="divider w-full h-px bg-gray-300 px-10 "></div>

        <ul className="pl-8">
          {sidebarMenus.map((menu) => (
            <li key={menu.path} className="mt-6">
              <Link
                href={menu.path}
                className={`flex gap-4 items-center text-gray-500 hover:text-primary-900 transition-all ${
                  menu.path === currentPath
                    ? "text-primary-900"
                    : "text-gray-500"
                }`}
              >
                <FontAwesomeIcon icon={menu.icon} />
                <span>{menu.name}</span>
              </Link>
            </li>
          ))}
          <li className="mt-6">
            <button
              className={
                "flex gap-4 items-center text-gray-500 hover:text-primary-900 transition-all text-gray-500"
              }
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="w-full lg:w-9/12">{children}</div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-100 py-6">
        <ul className="flex justify-evenly">
          {sidebarMenus.map((menu) => (
            <li key={menu.path}>
              <Link
                href={menu.path}
                className={`flex flex-col gap-3 items-center hover:text-primary-900 transition-all ${
                  menu.path === currentPath
                    ? "text-primary-900"
                    : "text-gray-500"
                }`}
              >
                <FontAwesomeIcon icon={menu.icon} className="text-xl" />
                <span>{menu.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              className={
                "flex flex-col gap-3 items-center hover:text-primary-900 transition-all text-gray-500"
              }
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </Container>
  );
}
