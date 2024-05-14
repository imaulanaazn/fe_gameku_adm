"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";
import TableReseller from "./components/TableReseller";
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

const Reseller = () => {
  const [data, setData] = useState<IUserPaginationWithSearch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const req = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/v1/user?type=reseller",
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
            {data && <TableReseller user={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default Reseller;
