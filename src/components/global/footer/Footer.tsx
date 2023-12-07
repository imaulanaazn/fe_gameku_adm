"use client";

import ButtonSocialMedia from "./ButtonSocialMedia";
import * as brandsIcon from "@fortawesome/free-brands-svg-icons";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";

interface DisplaySocialMedia {
    title: string;
    to: string;
    icon: string;
}

type BrandsIconType = Record<string, any>;

const Footer = () => {
    const [socialMedia, setSocialMedia] = useState<DisplaySocialMedia[]>([]);
    const [logo, setLogo] = useRecoilState(imageAtom);
    const [linkWhatsapp, setLinkWhatsapp] = useState("#");
    const getSocialMedia = async () => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/social-media", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await request.json();
        if (request.ok) {
            const whatsappButton = res.find((item: any) => new RegExp("whatsapp", "i").test(item.title));
            if (whatsappButton) {
                setLinkWhatsapp(whatsappButton.to);
            }
            setSocialMedia(res);
        }
    };

    const getLogo = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo_footer", {
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setLogo((prev) => ({
                ...prev,
                logo_footer: res[0].value,
            }));
        }
    };

    useEffect(() => {
        if (!logo.logo_footer) {
            getLogo();
        }
        getSocialMedia();
    }, []);

    return (
        <div className="mx-auto">
            <div className="flex px-5 lg:px-0 justify-center items-center gap-10 py-10 bg-white flex-wrap">
                <div className="flex flex-col items-center gap-3 lg:items-start">
                    <p className="font-montserrat font-light text-xs tracking-widest">OFFICIAL</p>
                    <h1 className="font-pulse font-semibold text-xl">Social Media</h1>
                    <div className="h-px bg-[#B72025] w-10"></div>
                </div>
                <div className="flex items-start gap-3 flex-wrap justify-between">
                    {socialMedia.map((value, i) => (
                        <ButtonSocialMedia
                            title={value.title}
                            icon={(brandsIcon as BrandsIconType)[value.icon]}
                            to={value.to || "#"}
                            key={i}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col px-5 sm:px-10 md:flex-row justify-center items-start gap-10 bg-[#B72025] mx-auto py-10 text-white font-montserrat text-sm flex-wrap">
                <Link href="/" className="h-36 w-36">
                    <Image
                        src={logo.logo_footer}
                        alt="Logo Gasskeun Topup"
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        className="object-contain"
                    />
                </Link>
                <div className=" max-w-xs">
                    <p className="pb-2 font-bold text-lg">About us</p>
                    <p className="font-semibold text-sm">
                        Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari
                        Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran
                        anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI
                        DANA, OVO, dll
                    </p>
                </div>
                <div className="lg:h-36 lg:w-px md:w-full md:bg-white md:border-1 md:h-px"></div>
                <div className="max-w-sm">
                    <div className="flex pt-10 justify-center items-center gap-5 font-bold text-lg">
                        <p>
                            MAU JOIN <br></br>RESELLER?
                        </p>
                        <Link
                            href={linkWhatsapp}
                            className="sm:py-4 sm:px-8 py-2 px-3 bg-white text-[#B72025] rounded-lg"
                        >
                            GABUNG SEKARANG!
                        </Link>
                    </div>
                </div>
            </div>
            <footer className="bg-black text-white py-4">
                <div className="container mx-auto">
                    <div className="text-center">
                        <p>&copy; {new Date().getFullYear()} Gasskeun Topup</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
