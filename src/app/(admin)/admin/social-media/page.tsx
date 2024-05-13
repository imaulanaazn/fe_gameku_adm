"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHeart, faSmile } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/admin/Header";
import TableSocialMedia from "@/components/admin/Social Media/TableSocialMedia";
import { IPromotionPagination } from "@/interfaces/promotion";
import { INewsVideosPagination } from "@/interfaces/newsVideo";
import Loading from "../loading";
import { ISocialMediaPagination } from "@/interfaces/socialMedia";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";

function IconSelector() {
  const [data, setData] = useState<ISocialMediaPagination | null>(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/sosmed", {
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
          <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-semibold">Halo Admin</h1>
                <p className="text-base mt-2">
                  Selamat datang di dashboard, semoga bisnis anda berjalan
                  lancar dan terus berkembang.
                </p>
              </div>
            </div>
          </div>
          <div className="stats-wrapper w-full px-8 -mt-10 mb-8">
            {!loading && <>{data && <TableSocialMedia data={data} />}</>}
          </div>
        </>
      )}
    </>
  );
}

export default IconSelector;
