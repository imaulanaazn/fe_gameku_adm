"use client";

import TableBanner from "@/app/(admin)/admin/banner/components/TableBanner";
import Header from "@/components/admin/Header";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { useEffect, useState } from "react";
import Loading from "./loading";
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminHeader from "@/components/admin/AdminHeader";

const Banner = () => {
  const [banners, setBanners] = useState<IImageCarouselPagination>();
  const [loading, setLoading] = useState(true);
  const getBanners = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/banner", {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (req.ok) {
      setBanners({ ...banners, ...res });
    }

    setLoading(false);
  };

  useEffect(() => {
    getBanners();
  }, []);
  return (
    <>
      {loading && <Loading />}
      <AdminNavbar />
      <AdminHeader />
      <div className="stats-wrapper px-6 lg:px-8 pb-6 lg:pb-8 mt-6 lg:-mt-10">
        {!loading && <>{banners && <TableBanner banner={banners} />}</>}
      </div>
    </>
  );
};

export default Banner;
