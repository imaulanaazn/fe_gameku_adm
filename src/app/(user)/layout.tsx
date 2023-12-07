"use client";

import "../globals.css";
import Footer from "@/components/global/footer/Footer";
import Header from "@/components/global/header/Header";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "@/components/maintenance/Maintenance";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [websiteStatus, setWebsiteStatus] = useState("");

    const getWebsiteStatus = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=website_status", {
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setWebsiteStatus(res[0].value);
        }
    };

    useEffect(() => {
        getWebsiteStatus();
    }, []);

    return (
        <html lang="en">
            <body>
                <RecoilRoot>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        draggable
                    />
                    {websiteStatus === "maintenance" && <Maintenance />}
                    {websiteStatus === "online" && (
                        <>
                            <Header />
                            {children}

                            <Footer />
                        </>
                    )}
                </RecoilRoot>
            </body>
        </html>
    );
}

