import React from "react";
import { usePathname } from "next/navigation";
import { adminMenu } from "../global/header/SideBarAdmin";
export default function AdminHeader({
  children,
}: {
  children?: React.JSX.Element;
}) {
  const path: string = usePathname();
  const pageName = adminMenu.find((menu) => "/admin" + menu.path === path);
  return (
    <div className="navbar-header lg:h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-auto md:bg-cover rounded-b-2xl md:rounded-b-3xl text-white px-10 md:px-12 py-10 md:pt-10">
      <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
        <div className="left-header">
          <h1 className="text-3xl md:text-4xl font-semibold md:font-semibold">
            Halo Admin
          </h1>
          <p className="text-base md:mt-2">
            Selamat datang di halaman {pageName?.title}, {pageName?.quote}
          </p>
        </div>
        <div className="right-header">{children}</div>
      </div>
    </div>
  );
}
