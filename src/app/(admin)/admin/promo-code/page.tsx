"use client";

import Header from "@/components/admin/Header";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import { IPromotionPagination } from "@/interfaces/promotion";
import TablePromoCode from "@/components/admin/promo-code/TablePromoCode";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

const PromoCode = () => {
  const [data, setData] = useState<IPromotionPagination>();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/promo-code",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
          <div className="stats-wrapper w-full px-6 lg:px-8 mt-6 lg:-mt-10 mb-6 lg:mb-8">
            {data && <TablePromoCode data={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default PromoCode;
