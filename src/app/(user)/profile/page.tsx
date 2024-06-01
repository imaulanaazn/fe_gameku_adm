import Maintenance from "@/components/maintenance/Maintenance";
import Profile from "@/components/profile/Profile";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next/types";

const Posts = async () => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }
  // const bg = await sendRequest<{ value: string }[]>(
  //   "/v1/config?type=bg_profile"
  // );
  return (
    <div className="w-full h-fit mx-auto grid align-middle">
      <Profile />
    </div>
  );
};



export const generateMetadata: () => Promise<
  Metadata | undefined
> = async () => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/profile", {}, 3600);
  if (!meta.ok) {
    return;
  }
  return {
    title: meta.data.title,
    icons: meta.data.icon,
    description: meta.data.description,
    keywords: JSON.parse(meta.data.keywords).join(","),
    openGraph: {
      url: process.env.NEXT_PUBLIC_HOST + "/profile",
      type: "website",
      siteName: "Gasskeun Topup",
      images: meta.data.image,
    },
    twitter: {
      card: meta.data.image,
    },
  } as Metadata;
};

export default Posts;
