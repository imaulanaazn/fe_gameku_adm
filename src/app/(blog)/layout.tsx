"use client";
import "../globals.css";
import BlankLayout from "@/@core/layouts/BlankLayout";
import Maintenance from "@/components/maintenance/Maintenance";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import BlogHeader from "./components/BlogHeader";
import { RecoilRoot } from "recoil";
import BlogFooter from "./components/BlogFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [websiteStatus, setWebsiteStatus] = useState("");

  const getWebsiteStatus = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=website_status",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      setWebsiteStatus(res[0].value);
    }
  };

  useEffect(() => {
    getWebsiteStatus();
  }, []);

  return (
    <html lang="id">
      <body>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          draggable
        />
        <RecoilRoot>
          <BlankLayout>
            <BlogHeader />
            {websiteStatus === "maintenance" && <Maintenance />}
            {websiteStatus === "online" && <>{children}</>}
            <BlogFooter />
          </BlankLayout>
        </RecoilRoot>

        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N8H8JT59"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript> */}
      </body>
    </html>
  );
}
