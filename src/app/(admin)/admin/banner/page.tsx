"use client";

import TableBanner from "@/components/admin/Banner/TableBanner";
import Header from "@/components/admin/Header";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { useEffect, useState } from "react";
import Loading from "./loading";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold">Halo Admin</h1>
            <p className="text-base mt-2">
              Selamat datang di dashboard, semoga bisnis anda berjalan lancar
              dan terus berkembang.
            </p>
          </div>
        </div>
      </div>
      <div className="stats-wrapper px-8 -mt-10">
        {!loading && <>{banners && <TableBanner banner={banners} />}</>}
      </div>
    </>
  );
};

export default Banner;
