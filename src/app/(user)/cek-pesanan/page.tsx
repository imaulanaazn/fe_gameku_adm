import FormCekPesanan from "@/components/cek-pesanan/FormCekPesanan";
import ResultCheckPesanan from "@/components/cek-pesanan/ResultCheckPesanan";
import Container from "@/components/global/Container/Container";
import Maintenance from "@/components/maintenance/Maintenance";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";
import Image from "next/image";

const CekPesanan = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  const bg = await sendRequest<{ value: string }[]>(
    "/v1/config?type=bg_checkorder"
  );
  return (
    <section>
      <Container className="py-24 lg:py-0 lg:my-24 bg-primary-900 lg:bg-white">
        <>
          <div className="flex flex-col-reverse lg:flex-row items-center gap-20 md:gap-16 xl:gap-36 lg:rounded-3xl  lg:p-20 lg:bg-primary-900">
            <div className="left-side w-full lg:w-2/3">
              <h1 className="font-bold text-white text-4xl lg:text-5xl">
                Cek Detail Transaksimu Dengan Mudah
              </h1>
              <p className="mt-3 lg:mt4 text-white max-w-lg">
                Mencari detail transaksi sekarang lebih mudah dengan hanya
                menggunakan no whatsapp / kode transaksi dari transaksi yang
                telah kamu lakukan
              </p>
              <div className="flex flex-col gap-3">
                <FormCekPesanan />
              </div>
              <p className="text-sm font-light text-white mt-4">
                jika pesananmu tidak muncul dalam 2 jam, hubungi kami{" "}
                <a
                  href="https://api.whatsapp.com/send?phone=628112065672"
                  className="underline decoration-solid font-medium"
                >
                  disini
                </a>
              </p>
            </div>
            <div className="right-side lg:w-1/3 hidden lg:block">
              <Image
                src="/images/valorant-agent.png"
                width={300}
                height={400}
                sizes="40vh"
                alt="no game found"
                className="max-h-96 object-contain"
              />
            </div>
          </div>
          <ResultCheckPesanan />
        </>
      </Container>
    </section>
  );
};

export const generateMetadata = async () => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/cek-pesanan", {}, 3600);
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

export default CekPesanan;
