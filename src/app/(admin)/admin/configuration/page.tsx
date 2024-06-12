"use client";

import { whatsappTemplateState } from "@/atom/whatsappTemplateState";
import ChangeLogo from "../../../../components/admin/configuration/ChangeLogo";
import StatusWebsite from "../../../../components/admin/configuration/StatusWebsite";
import TemplateMessage from "../../../../components/admin/configuration/TemplateMessage";
import Whatsapp from "../../../../components/admin/configuration/Whatsapp";
import Xendit from "../../../../components/admin/configuration/Xendit";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import BackgroungImages from "../../../../components/admin/configuration/BackgroungImages";
import ChangeLogoFooter from "../../../../components/admin/configuration/ChangeLogoFooter";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

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
      <AdminHeader />
      <div className="wrapper w-full px-6 lg:px-8 pb-6 lg:pb-8 pt-0 mt-6 lg:-mt-12">
        <div className="website-config bg-white rounded-xl p-6 lg:p-8 mb-6 lg:mb-8">
          <div>
            <StatusWebsite />
            <div className="flex flex-col xl:flex-row mt-6 lg:mt-8 gap-6">
              <div className="mt-2 w-full xl:w-1/2">
                <h1 className="mb-4 font-medium text-xl md:text-2xl text-neutral-800">
                  Logo Website
                </h1>
                <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                  <ChangeLogo />
                  <ChangeLogoFooter />
                </div>
              </div>
              <div className="mt-2 w-full xl:w-1/2">
                <BackgroungImages />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 mb-6 lg:mb-8">
          <Whatsapp />
          {listTemplate.length > 0 && <TemplateMessage />}
        </div>

        <div className="mt-4 bg-white rounded-xl p-6 lg:p-8 w-full lg:w-1/2">
          <Xendit />
        </div>
      </div>
    </>
  );
};

export default Configuration;
