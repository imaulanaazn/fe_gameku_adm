"use client";

import "../globals.css";
import Footer from "@/components/global/footer/Footer";
import Header from "@/components/global/header/Header";
import { RecoilRoot } from "recoil";
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
                    <Header />
                    {children}
                    <Footer />
                </RecoilRoot>
            </body>
        </html>
    );
}

