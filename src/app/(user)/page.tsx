import Carousel from "@/components/home/carousel/Carousel";
import ListGames from "@/components/home/listGame/ListGames";
import PopularGames from "@/components/home/PopularGames/PopularGames";
import NewsPost from "@/components/home/newsPost/NewsPost";
import NewsVideo from "@/components/home/newsVideo/NewsVideo";
import Maintenance from "@/components/maintenance/Maintenance";
import { IImageCarousel } from "@/interfaces/carousels";
import { INewsVideos } from "@/interfaces/newsVideo";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";
import CompLayanan from "@/components/layanan/CompLayanan";
import Container from "@/components/global/Container/Container";
import Image from "next/image";
import Footer from "@/components/global/footer/Footer";

const defaultCategory = [
  {
    id: "all",
    name: "Semua Game",
  },
  { id: "popular", name: "Game Popular" },
];

const Home = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  const slides = await sendRequest<IImageCarousel[]>("/v1/banners");
  const popularGames = await sendRequest<IGame[]>("/v1/games?isPopular=true");
  const categoriesAndGames = await sendRequest<IGameCategoryWithGame[]>(
    "/v1/games-category?withGame=true"
  );
  const gameCategories = await sendRequest<IGameCategory[]>(
    "/v1/games-category"
  );
  const games = await sendRequest<IGame[]>("/v1/games");
  const posts = await sendRequest<{ data: INewsPost[]; totalData: number }>(
    "/v1/newest-articles?limit=3"
  );
  const youtubeVideo = await sendRequest<INewsVideos[]>("/v1/videos");

  return (
    <div>
      {slides.data.length > 0 && <Carousel slides={slides.data} />}

      {popularGames.data.length > 0 && (
        <PopularGames popularGames={popularGames.data} />
      )}

      <CompLayanan
        defaultCategory={defaultCategory}
        games={games.data}
        gameCategories={gameCategories.data}
      />

      {categoriesAndGames.data.map((data, index) => (
        <ListGames key={index} title={data.name} data={data.games} />
      ))}

      {youtubeVideo.data.length > 0 && <NewsVideo videos={youtubeVideo.data} />}

      <NoGameFound />

      {posts.data.data.length > 0 && <NewsPost posts={posts.data.data} />}
    </div>
  );
};

export default Home;

const NoGameFound = () => {
  return (
    <section className="bg-primary-900 py-16 lg:py-24">
      <Container>
        <div className="flex gap-20 flex-col-reverse lg:flex-row items-center">
          <div className="left-side flex-1">
            <h1 className="font-bold text-white text-4xl lg:text-5xl">
              Gak nemuin yang kamu cari?
            </h1>
            <p className="mt-3 lg:mt4 text-white max-w-lg">
              Yuk segera hubungi kami dan beritahu kami tentang keluhan /
              saranmu kepada gasskeun top up agar kami bisa melayani pelanggan
              lebih baik lagi.
            </p>
            <button className="bg-white text-primary-900 mt-8 lg:text-sm rounded-md py-2 px-4 lg:py-3 lg:px-5 font-semibold lg:font-medium">
              Hubungi sekarang
            </button>
          </div>
          <div className="hidden lg:block right-side flex-1">
            <Image
              src="/images/no_game_found.svg"
              width={400}
              height={400}
              alt="no game found"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export const generateMetadata = async ({ params }: { params: string }) => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/", {}, 3600);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"
    ),
    title: meta.data.title,
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
      canonical: "/",
    },
    openGraph: {
      title: meta.data.title,
      url: process.env.NEXT_PUBLIC_HOST,
      type: "website",
      siteName: "Gasskeun Topup",
      images: meta.data.image,
      description: meta.data.description,
    },
    twitter: {
      card: "summary_large_image",
      images: meta.data.image,
      title: meta.data.title,
      description: meta.data.description,
    },
    robots: {
      index: true,
      follow: false,
      nocache: false,
    },
  } as Metadata;
};
