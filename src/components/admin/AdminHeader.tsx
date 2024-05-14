import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { usePathname } from "next/navigation";
import { MENU } from "../global/header/SideBarAdmin";
export default function AdminHeader({
  children,
}: {
  children: React.JSX.Element;
}) {
  const path: string = usePathname();
  const pageName = MENU.find((menu) => menu.link === path);
  return (
    <div className="navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
      <div className="flex justify-between items-center">
        <div className="left-header">
          <h1 className="text-4xl font-semibold">Halo Admin</h1>
          <p className="text-base mt-2">
            Selamat datang di halaman {pageName?.name}, {pageName?.quote}
          </p>
        </div>
        <div className="right-header">{children}</div>
      </div>
    </div>
  );
}
