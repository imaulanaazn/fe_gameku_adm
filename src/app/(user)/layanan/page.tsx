import CompLayanan from "@/components/user/layanan/CompLayanan";
import Maintenance from "@/components/global/maintenance/Maintenance";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";
import ListGames from "@/components/user/home/ListGames";

const defaultCategory = [
  {
    id: "all",
    name: "Semua Game",
  },
  { id: "popular", name: "Game Popular" },
];

const Layanan = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  const gameCategories = await sendRequest<IGameCategory[]>(
    "/v1/games-category"
  );

  const games = await sendRequest<IGame[]>("/v1/games");

  const categoriesAndGames = await sendRequest<IGameCategoryWithGame[]>(
    "/v1/games-category?withGame=true"
  );

  return (
    <div className="container mx-auto pt-10 bg-darkPrimary">
      <CompLayanan
        defaultCategory={defaultCategory}
        gameCategories={gameCategories.data}
        games={games.data}
      />

      {categoriesAndGames.data.map((data, index) => (
        <ListGames key={index} title={data.name} data={data.games} />
      ))}
    </div>
  );
};

export default Layanan;

export const generateMetadata = async ({ params }: { params: string }) => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/layanan", {}, 3600);
  if (!meta.ok) {
    return;
  }
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
