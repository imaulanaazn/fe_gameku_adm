import FormLogin from "@/components/login/FormLogin";
import Maintenance from "@/components/maintenance/Maintenance";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Login = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  const gasskeunLogo = await sendRequest<{ value: string }[]>(
    "/v1/config?type=logo"
  );
  const bg = await sendRequest<{ value: string }[]>("/v1/config?type=bg_login");
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  return (
    <div
      style={{
        backgroundImage: `url('${bg.data[0].value}')`,
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className="w-full h-screen mx-auto flex items-center"
    >
      <div className="mx-auto text-center w-full h-screen lg:h-max flex items-center lg:items-stretch justify-center overflow-hidden">
        <div className="left-side bg-white w-full md:w-[25rem] lg:w-96 xl:w-[30rem] h-full md:h-max px-10 py-10 xl:px-16 xl:py-16 flex flex-col justify-center">
          <div className="flex flex-col items-center gap-3 mb-8 xl:mb-10">
            <p className="xl:hidden font-light text-xs tracking-widest">
              GASSKEUN TOPUP
            </p>
            <h1 className="text-center text-neutral-900 text-3xl font-bold">
              Masuk
            </h1>
            <p className="hidden xl:block text-left">
              Selamat datang kembali. segera login agar bisa mengakses fitur
              gasskeun top up
            </p>
          </div>
          <FormLogin />
          <p className=" text-sm mt-5">
            Belum punya akun? Silahkan untuk{" "}
            <Link href="/register" className=" underline text-primary-900">
              Daftar
            </Link>
          </p>
        </div>

        <div className="right-side hidden lg:flex w-96 xl:w-[30rem] h-auto px-10 py-10 xl:px-16 xl:py-16 bg-primary-900 items-center justify-center">
          <div className="h-max w-max">
            <Image
              src={gasskeunLogo.data[0].value}
              width={120}
              height={120}
              alt="gasskeun top up logo"
              className="mx-auto"
            />
            <p className="text-xs text-white text-left mt-16 mb-4">
              GASKEUN TOP UP
            </p>
            <h4 className="text-white text-left xl:text-lg">
              Top up berbagai kebutuhan digital mu lebih mudah menggunakan
              gasskeun top up
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export const generateMetadata = async () => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/login", {}, 3600);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"
    ),
    title: meta.data.title + " - Gasskeun Topup",
    icons: {
      icon: {
        sizes: "32x32",
        url: meta.data.icon,
        type: "image/png",
      },
      shortcut: {
        sizes: "64x64",
        url: meta.data.icon,
        type: "image/png",
      },
      apple: {
        sizes: "120x120",
        url: meta.data.icon,
        type: "image/png",
      },
      other: [
        {
          rel: "apple-touch-icon-precomposed",
          url: meta.data.icon,
          sizes: "152x152",
        },
        {
          rel: "apple-touch-icon-120x120",
          url: meta.data.icon,
          sizes: "120x120",
        },
        {
          rel: "apple-touch-icon-120x120-precomposed",
          url: meta.data.icon,
          sizes: "120x120",
        },
      ],
    },
    description: meta.data.description,
    keywords: JSON.parse(meta.data.keywords).join(","),
    authors: [
      {
        name: "gasskeuntopup",
        url: new URL(
          process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"
        ),
      },
    ],
    alternates: {
      canonical: meta.data.path,
    },
    openGraph: {
      title: meta.data.title + " - Gasskeun Topup",
      url: process.env.NEXT_PUBLIC_HOST + meta.data.path,
      type: "website",
      siteName: "Gasskeun Topup",
      images: meta.data.image,
      description: meta.data.description,
    },
    twitter: {
      card: "summary_large_image",
      images: meta.data.image,
      title: meta.data.title + " - Gasskeun Topup",
      description: meta.data.description,
    },
    robots: {
      index: true,
      follow: false,
      nocache: false,
    },
  } as Metadata;
};

export default Login;
