import FormCekPesanan from "@/components/cek-pesanan/FormCekPesanan";
import ResultCheckPesanan from "@/components/cek-pesanan/ResultCheckPesanan";
import Maintenance from "@/components/maintenance/Maintenance";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";

const CekPesanan = async () => {
    const statusWebsite = await sendRequest<{ value: string }[]>("/v1/config?type=website_status");
    if (statusWebsite.data[0].value === "maintenance") {
        return <Maintenance />;
    }

    const bg = await sendRequest<{ value: string }[]>("/v1/config?type=bg_checkorder");
    return (
        <div
            style={{
                backgroundImage: `url('${bg.data[0].value}')`,
                backgroundColor: "black",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
            className="w-full h-fit mx-auto grid align-middle"
        >
            <div className="mx-auto pt-10 h-fit min-h-screen text-center w-full p-5 font-pulse text-white flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-10">
                    <p className="font-pulse font-light text-xs tracking-widest">SILAHKAN</p>
                    <h1 className="font-pulse font-semibold text-3xl">Cek Pesanan</h1>
                </div>
                <FormCekPesanan />
                <ResultCheckPesanan />
            </div>
        </div>
    );
};

export const generateMetadata = async () => {
    const meta = await sendRequest<IMeta>("/v1/meta?path=/cek-pesanan", {}, 3600);
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"),
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
                url: new URL(process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"),
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
