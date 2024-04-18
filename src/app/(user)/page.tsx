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

const Home = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  const slides = await sendRequest<IImageCarousel[]>("/v1/banners");
  const popularGames = await sendRequest<IGame[]>("/v1/games?isPopular=true");
  const gameCategories = await sendRequest<IGameCategoryWithGame[]>(
    "/v1/games-category?withGame=true"
  );
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

      {gameCategories.data.map((data, index) => (
        <ListGames
          key={index}
          backgroundColor={index % 2 === 0 ? "bg-white" : "bg-[#F4F4F4]"}
          title={data.name}
          data={data.games}
        />
      ))}
      {posts.data.data.length > 0 && <NewsPost posts={posts.data.data} />}
      {youtubeVideo.data.length > 0 && <NewsVideo videos={youtubeVideo.data} />}
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
