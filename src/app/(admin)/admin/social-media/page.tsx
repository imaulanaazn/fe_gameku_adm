"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHeart, faSmile } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/admin/Header";
import TableSocialMedia from "@/components/admin/social-media/TableSocialMedia";
import { IPromotionPagination } from "@/interfaces/promotion";
import { INewsVideosPagination } from "@/interfaces/newsVideo";
import Loading from "../(dashboard)/loading";
import { ISocialMediaPagination } from "@/interfaces/socialMedia";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

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
          <AdminHeader />
          <div className="wrapper pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            {!loading && <>{data && <TableSocialMedia data={data} />}</>}
          </div>
        </>
      )}
    </>
  );
}

export default IconSelector;
