"use client";

import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/global/footer/Footer";
import Header from "@/components/global/header/Header";
import { RecoilRoot } from "recoil";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <RecoilRoot>
                    <Header />
                    {children}

                    <Footer />
                </RecoilRoot>
            </body>
        </html>
    );
}

