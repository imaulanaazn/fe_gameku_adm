"use client";

import "../globals.css";
import { RecoilRoot } from "recoil";
import SideBarAdmin from "@/components/global/header/SideBarAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                    <div className="flex w-full text-sm h-screen">
                        <SideBarAdmin />
                        <div className="w-full p-4 bg-gray-100 overflow-y-scroll">{children}</div>
                    </div>
                </RecoilRoot>
            </body>
        </html>
    );
}
