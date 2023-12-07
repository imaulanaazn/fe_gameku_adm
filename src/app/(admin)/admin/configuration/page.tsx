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

const Configuration = () => {
    const [listTemplate, setListTemplate] = useRecoilState(whatsappTemplateState);
    const [activeTab, setActiveTab] = useState("website");

    const TABS = [
        { id: "website", label: "Website" },
        { id: "whatsapp", label: "Whatsapp" },
        { id: "xendit", label: "Xendit" },
    ];

    const getListTemplate = async () => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/whatsapp?withContent=true", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

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
            <Header title="Konfigurasi" />
            <div className="w-full font-montserrat mt-5 p-5 bg-white rounded-lg shadow-lg">
                <ul className="flex flex-wrap -mb-px">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? "text-[#B72025] border-b-2 border-[#B72025]"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                            } font-montserrat font-semibold inline-block p-4 border-b-2 rounded-t-lg`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </ul>
                {activeTab === "website" && (
                    <div>
                        <div className="w-full flex">
                            <div className="mt-4 flex gap-4 w-1/2">
                                <ChangeLogo />
                                <StatusWebsite />
                            </div>
                            <div className="mt-4 flex gap-4 w-1/2">
                                <BackgroungImages />
                            </div>
                        </div>
                        <ChangeLogoFooter />
                    </div>
                )}

                {activeTab === "whatsapp" && (
                    <div>
                        <Whatsapp />
                        {listTemplate.length > 0 && <TemplateMessage />}
                    </div>
                )}

                {activeTab === "xendit" && (
                    <div className="mt-4 w-2/3">
                        <Xendit />
                    </div>
                )}
            </div>
        </>
    );
};

export default Configuration;
