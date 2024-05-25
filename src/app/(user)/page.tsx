import Carousel from "@/components/home/carousel/Carousel";
import ListGames from "@/components/home/listGame/ListGames";
import PopularGames from "@/components/home/PopularGames/PopularGames";
import NewsPost from "@/components/home/newsPost/NewsPost";
import Maintenance from "@/components/maintenance/Maintenance";
import { IImageCarousel } from "@/interfaces/carousels";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";
import CompLayanan from "@/components/layanan/CompLayanan";
import NoGameFound from "@/components/home/NoGameFound/NoGameFound";
import NewsVideo from "@/components/home/newsVideo/NewsVideo";
import { INewsVideos } from "@/interfaces/newsVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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
    <div className="bg-blurry-red">
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

      <a
        href="https://api.whatsapp.com/send?phone=628112065672"
        target="_blank"
        className="w-12 h-12 md:w-16 md:h-16 lg:w-14 lg:h-14 bg-green-500 rounded-full fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center"
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          className="text-white text-3xl md:text-4xl lg:text-4xl"
        />
      </a>
    </div>
  );
};

export default Home;

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
