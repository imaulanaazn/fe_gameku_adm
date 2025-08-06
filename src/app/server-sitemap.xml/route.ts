import sendRequest from "@/lib/baseApi";
import { getServerSideSitemap } from "next-sitemap";

export async function GET(request: Request) {
  const meta = await sendRequest<IMeta[]>("/v1/meta?only=path");
  const newMeta = meta.data.map((item) => {
    return {
      loc: "https://topupgameku.shop" + (item.path === "/" ? "" : item.path),
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1,
    };
  }) as any;

  return getServerSideSitemap(newMeta);
}
