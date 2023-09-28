"use client";

import TemplateMessage from "@/components/admin/Configuration/TemplateMessage";
import Whatsapp from "@/components/admin/Configuration/Whatsapp";
import Xendit from "@/components/admin/Configuration/Xendit";
import Header from "@/components/admin/Header";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Configuration = () => {
    const [listTemplate, setListTemplate] = useState<ITemplateMessage[]>([]);
    const getListTemplate = async () => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/whatsapp?withContent=true", {
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
            <div className="w-full font-montserrat">
                <div className="flex space-x-3">
                    <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                        <h1 className="text-xl font-semibold">Xendit</h1>
                        <table className="table-auto w-full">
                            <tbody>
                                <Xendit field="secretKey" title="API Secret Key" />
                                <Xendit field="secretKey" title="Webhook Verrification Key" />
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                        <h1 className="text-xl font-semibold">Whatsapp</h1>
                        <Whatsapp />
                    </div>
                </div>
                {listTemplate.length > 0 && <TemplateMessage data={listTemplate} />}
            </div>
        </>
    );
};

export default Configuration;
