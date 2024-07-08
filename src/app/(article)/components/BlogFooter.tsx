"use client";

import * as brandsIcon from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { imageAtom } from "@/atom/logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "@/components/global/Container/Container";

const linkCepat = [
  {
    id: 1,
    name: "Beranda",
    url: "/blog",
  },
  {
    id: 2,
    name: "Top Up",
    url: "/",
  },
  {
    id: 3,
    name: "Reseller",
    url: "https://reseller.gasskeuntopup.com/",
  },
];

interface DisplaySocialMedia {
  title: string;
  to: string;
  icon: string;
}

type BrandsIconType = Record<string, any>;

const BlogFooter = () => {
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
    <footer className="bg-black py-14 lg:py-20">
      <Container>
        <div>
          {/* UPPER FOOTER */}
          <div className="md:flex justify-between items-end">
            <h2 className="flex-1 text-white text-2xl lg:text-3xl font-bold">
              Top-up Lebih Mudah Di Gasskeun Top-up
            </h2>
            <div className="hidden lg:block flex-1 flex items-center justify-center">
              <Link href="/">
                <Image
                  src={logo.logo_footer || ""}
                  alt="Logo Gasskeun Topup"
                  width="160"
                  height="160"
                  sizes="10vw"
                  className="object-contain mx-auto"
                />
              </Link>
            </div>
            <div className="flex-1 flex justify-end mt-8">
              <a
                href="https://reseller.gasskeuntopup.com/"
                target="_blank"
                className="w-full md:w-max bg-primary-900 py-3 px-5 text-white rounded-full font-semibold hover:bg-white hover:text-black text-center"
              >
                Top Up Sekarang
              </a>
            </div>
          </div>

          <div className="border-b border-neutral-400 border-solid my-8 md:my-12 lg:my-16"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-between gap-y-14 gap-x-5 md:gap-y-8 lg:gap-x-16">
            {/* GASSKEUN TOP UP EXPLANATION FOOTER SECTION */}
            <div className="col-start-1 col-end-3 md:col-end-4 lg:col-end-3">
              <h2 className="text-white font-bold text-lg uppercase">
                Tentang Gasskeun Top-up
              </h2>
              <p className="text-white mt-4 lg:mt-6">
                Gasskeun Top Up adalah sebuah website topup game online
                terpercaya di Indonesia mulai dari Mobile Legends, PUBG Mobile,
                Free Fire, dan masih banyak lainnya. untuk mempermudah
                pembayaran anda disini kami juga menyediokan metode pembayaran
                Alfamart, Bank BCA, Bank Mandiri, Bank BNI DANA, OVO, dll
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
                  <li className="text-neutral-400 mt-3" key={link.id}>
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
                  <li className="text-neutral-400 mt-3" key={item.title}>
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
              <p className="text-white font-bold uppercase">Blog</p>
              <Link
                className="text-neutral-400 w-max inline-block mt-3 border-b border-solid border-black hover:border-white hover:text-white"
                href="#"
              >
                Blog Terbaru
              </Link>
              <Link
                className="text-neutral-400 w-max inline-block mt-3 border-b border-solid border-black hover:border-white hover:text-white"
                href="#"
              >
                Popular
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default BlogFooter;
