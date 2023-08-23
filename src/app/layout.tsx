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

export const generateMetadata = () => {
    return {
        title: "Gasskeun TOPUP - Beli Voucher Game Online di Gasskeun Topup Cepat dan Mudah!",
        description:
            "Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI DANA, OVO, dll",
    } as Metadata;
};

