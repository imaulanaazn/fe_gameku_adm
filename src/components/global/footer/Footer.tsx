"use client";

import ButtonSocialMedia from "./ButtonSocialMedia";
import * as brandsIcon from "@fortawesome/free-brands-svg-icons";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import Container from "../Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const linkCepat = [
  {
    id: 1,
    name: "Beranda",
    url: "#beranda",
  },
  {
    id: 2,
    name: "Masuk",
    url: "/login",
  },
  {
    id: 3,
    name: "Daftar",
    url: "/register",
  },
  {
    id: 4,
    name: "Cek pesanan",
    url: "/cek-pesanan",
  },
  {
    id: 5,
    name: "Reseller",
    url: "https://reseller.gasskeuntopup.com/",
  },
  {
    id: 6,
    name: "Artikel",
    url: "/article",
  },
];

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
    const request = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/social-media",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await request.json();
    if (request.ok) {
      const whatsappButton = res.find((item: any) =>
        new RegExp("whatsapp", "i").test(item.title)
      );
      if (whatsappButton) {
        setLinkWhatsapp(whatsappButton.to);
      }
      setSocialMedia(res);
    }
  };

  const getLogo = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo_footer",
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
    <footer className="bg-darkSecondary pt-12 lg:pt-20">
      <Container className="py-12 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-between gap-y-14 gap-x-5 md:gap-y-8 lg:gap-x-16">
          {/* GASSKEUN TOP UP EXPLANATION FOOTER SECTION */}
          <div className="col-start-1 col-end-3 md:col-end-4 lg:col-end-3">
            <h2 className="text-white font-bold text-lg uppercase">
              Tentang Topup Game-Ku
            </h2>
            <p className="text-white mt-4 lg:mt-6">
              Topup Game-Ku adalah sebuah website topup game online terpercaya
              di Indonesia mulai dari Mobile Legends, PUBG Mobile, Free Fire,
              dan masih banyak lainnya. untuk mempermudah pembayaran anda disini
              kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank
              Mandiri, Bank BNI DANA, OVO, dll
            </p>
            <div className="flex flex-wrap mt-4">
              {socialMedia.map((value) => (
                <Link
                  key={value.title}
                  href={value.to}
                  target="_blank"
                  className="text-white text-sm px-4"
                >
                  <FontAwesomeIcon
                    icon={(brandsIcon as BrandsIconType)[value.icon]}
                    size="xl"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* LINK CEPAT GRID ITEM */}
          <div className="flex flex-col">
            <p className="text-white font-bold uppercase mb-2 lg:mb-4">
              Link Cepat
            </p>
            <ul>
              {linkCepat.map((link) => (
                <li className="text-neutral-300 mt-3" key={link.id}>
                  <Link
                    className="border-b border-solid border-black hover:border-white hover:text-white"
                    href={link.url}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL MEDIA GRID ITEM */}
          <div className="flex flex-col">
            <p className="text-white font-bold uppercase mb-2 lg:mb-4">
              Ikuti Kami
            </p>
            <ul>
              {socialMedia.map((item) => (
                <li className="text-neutral-300 mt-3" key={item.title}>
                  <Link
                    className="border-b border-solid border-black hover:border-white hover:text-white"
                    target="_blank"
                    href={item.to}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL GRID ITEM */}
          <div className="flex flex-col">
            <p className="text-white font-bold uppercase">Legal</p>
            <Link
              className="text-neutral-300 inline-block mt-3 border-b border-solid border-black hover:border-white hover:text-white"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-neutral-300 inline-block mt-3 border-b border-solid border-black hover:border-white hover:text-white"
              href="#"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
