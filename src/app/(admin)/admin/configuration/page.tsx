"use client";

import { whatsappTemplateState } from "@/atom/whatsappTemplateState";
import ChangeLogo from "@/components/admin/Configuration/ChangeLogo";
import StatusWebsite from "@/components/admin/Configuration/StatusWebsite";
import TemplateMessage from "@/components/admin/Configuration/TemplateMessage";
import Whatsapp from "@/components/admin/Configuration/Whatsapp";
import Xendit from "@/components/admin/Configuration/Xendit";
import Header from "@/components/admin/Header";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";
import BackgroungImages from "@/components/admin/Configuration/BackgroungImages";
import ChangeLogoFooter from "@/components/admin/Configuration/ChangeLogoFooter";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";

const Configuration = () => {
  const [listTemplate, setListTemplate] = useRecoilState(whatsappTemplateState);

  const getListTemplate = async () => {
    const request = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/whatsapp?withContent=true",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await request.json();
    if (request.ok) {
      setListTemplate(res);
    }
  };

  useEffect(() => {
    getListTemplate();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
        <h1 className="text-4xl font-semibold">Hello Admin</h1>
        <p className="text-base mt-2">
          Selamat datang di dashboard, semoga bisnis anda berjalan lancar dan
          terus berkembang.
        </p>
      </div>
      <div className="wrapper w-full p-8 pt-0 -translate-y-8">
        <div className="website-config bg-white shadow-md rounded-xl p-8 mb-8">
          <h1 className="font-medium text-2xl text-neutral-800 w-full">
            konfigurasi Website
          </h1>
          <div>
            <StatusWebsite />
            <div className="w-full flex">
              <div className="mt-4 flex gap-4 w-1/2">
                <ChangeLogo />
                <ChangeLogoFooter />
              </div>
              <div className="mt-4 flex gap-4 w-1/2">
                <BackgroungImages />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Whatsapp />
          {listTemplate.length > 0 && <TemplateMessage />}
        </div>

        <div className="mt-4 w-2/3">
          <Xendit />
        </div>
      </div>
    </>
  );
};

export default Configuration;
