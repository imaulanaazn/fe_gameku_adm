"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";
import TableVoucherGame from "../../../../components/admin/game-voucher/TableVoucherGame";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

const PromoCode = () => {
  const [data, setData] = useState<IVoucherGamePagination | null>(null);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/voucher-game?sort=gameName&order=ASC",
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
          <div className="wrapper pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            {!loading && data && <TableVoucherGame data={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default PromoCode;
