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

  console.log(gasskeunLogo);
  return (
    <div
      style={{
        backgroundImage: `url('${bg.data[0].value}')`,
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className="w-full h-fit mx-auto flex"
    >
      <div className="mx-auto pt-10 h-fit min-h-screen text-center w-full p-5  text-white flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 mb-10">
          <p className=" font-light text-xs tracking-widest">GASSKEUN TOPUP</p>
          <h1 className=" font-semibold text-3xl">Masuk</h1>
        </div>
        <FormLogin />
        <p className=" text-sm mt-5">
          Belum punya akun? Silahkan untuk{" "}
          <Link href="/register" className=" underline">
            Daftar
          </Link>
        </p>
      </div>
      <div className="right-side bg-primary-900 w-80">
        <Image src={gasskeunLogo} alt="Logo gaskkeun topup" />
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
