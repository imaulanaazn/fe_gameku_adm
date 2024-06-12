"use client";

import { useEffect, useState } from "react";
import Header from "@/components/admin/Header";
import TableYoutubeVideo from "../../../../components/admin/youtube/TableYoutubeVideo";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { INewsVideosPagination } from "@/interfaces/newsVideo";
import Loading from "@/components/global/loading/CompLoading";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

const Youtube = () => {
  const [data, setData] = useState<INewsVideosPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/youtube", {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (req.ok) {
      setData({ ...data, ...res });
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AdminNavbar />
          <AdminHeader />
          <div className="wrapper w-full pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            {data && <TableYoutubeVideo data={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default Youtube;
