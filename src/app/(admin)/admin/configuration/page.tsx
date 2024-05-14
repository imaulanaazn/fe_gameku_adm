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
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";

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
      <div className="wrapper w-full p-8 pt-0 -mt-12">
        <div className="website-config bg-white rounded-xl p-8 mb-8">
          <div>
            <StatusWebsite />
            <div className="flex mt-8">
              <div className="mt-2 w-1/2">
                <h1 className="font-medium text-2xl text-neutral-800 w-full mb-4">
                  Logo Website
                </h1>
                <div className="flex gap-8">
                  <ChangeLogo />
                  <ChangeLogoFooter />
                </div>
              </div>
              <div className="w-1/2 mt-2 ">
                <BackgroungImages />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8">
          <Whatsapp />
          {listTemplate.length > 0 && <TemplateMessage />}
        </div>

        <div className="mt-4 bg-white rounded-xl p-8 w-1/2">
          <Xendit />
        </div>
      </div>
    </>
  );
};

export default Configuration;
