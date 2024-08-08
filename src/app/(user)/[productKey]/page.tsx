import { Metadata } from "next";
import NotFound from "./not-found";
import sendRequest from "@/lib/baseApi";
import Maintenance from "@/components/global/maintenance/Maintenance";
import NewFormTopup from "@/components/user/pageProduct/NewFormTopup";
import Container from "@/components/global/Container/Container";
import Script from "next/script";
interface IParams {
  params: {
    productKey: string;
  };
}

const page = async ({ params }: IParams) => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }
  const gameDetail = await sendRequest<IGameDetail>(
    "/v1/game-detail?slug=" + params.productKey
  );
  if (!gameDetail.ok) {
    return <NotFound />;
  }
  const paymentsMethod = await sendRequest<IPaymentMethod[]>(
    "/v1/payments-method?query=9&type=payment"
  );

  const ratings = await sendRequest<IReviewsResponse>(
    `/v1/order-review?gameId=${gameDetail.data.id}`
  );

  const { minPrice, maxPrice } = gameDetail.data.products.reduce(
    (acc: { minPrice: number; maxPrice: number }, item: IProductsGame) => {
      if (item.price < acc.minPrice) acc.minPrice = item.price;
      if (item.price > acc.maxPrice) acc.maxPrice = item.price;
      return acc;
    },
    { minPrice: Infinity, maxPrice: -Infinity }
  );

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: gameDetail.data.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratings.data.averageRating || 0,
      reviewCount: ratings.data.averageRating || 0,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice,
      highPrice: maxPrice,
      priceCurrency: "IDR",
      availability: true
        ? "http://schema.org/InStock"
        : "http://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Script
        id="aggregate-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div className="bg-blurry-red pb-10">
        <Container>
          {/* <div className="mx-auto "> */}
          <NewFormTopup
            products={gameDetail.data}
            paymentsMethod={paymentsMethod.data}
          />
          {/* <FormTopup products={gameDetail.data} paymentsMethod={paymentsMethod.data} /> */}
          {/* </div> */}
        </Container>
      </div>
    </>
  );
};

export const generateMetadata = async ({ params }: IParams) => {
  const meta = await sendRequest<IMeta>(
    "/v1/meta?path=/" + params.productKey,
    {},
    3600
  );

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
      canonical: "/",
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

export default page;
