"use client";

import Header from "@/components/admin/Header";
import TableUser from "@/components/admin/User/TableUser";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import TableReseller from "@/components/admin/Reseller/TableReseller";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";

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
          <div className="stats-wrapper px-8 -mt-10 mb-8">
            {data && <TableReseller user={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default Reseller;
