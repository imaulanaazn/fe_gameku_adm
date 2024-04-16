"use client";

import "../globals.css";
import Footer from "@/components/global/footer/Footer";
import Header from "@/components/global/header/Header";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "@/components/maintenance/Maintenance";
import { useEffect, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SettingsProvider, SettingsConsumer } from "@/@core/context/settingsContext";
import ThemeComponent from "@/@core/theme/ThemeComponent";
import BlankLayout from "@/@core/layouts/BlankLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";
import Script from "next/script";

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
            <Script
                strategy="lazyOnload"
                id="gtm"
                dangerouslySetInnerHTML={{
                    __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-N8H8JT59');
  `,
                }}
            />

            <body className="font-monserrat">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    draggable
                />
                <RecoilRoot>
                    <AppRouterCacheProvider>
                        <SettingsProvider>
                            <SettingsConsumer>
                                {({ settings }) => {
                                    return (
                                        <ThemeComponent settings={settings}>
                                            <BlankLayout>
                                                {websiteStatus === "maintenance" && <Maintenance />}
                                                {websiteStatus === "online" && (
                                                    <>
                                                        <Header />
                                                        {children}

                                                        <Footer />
                                                    </>
                                                )}
                                            </BlankLayout>
                                        </ThemeComponent>
                                    );
                                }}
                            </SettingsConsumer>
                        </SettingsProvider>
                    </AppRouterCacheProvider>
                </RecoilRoot>
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTAG_ID || "F628FT0B41"} />
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-N8H8JT59"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
            </body>
        </html>
    );
}

