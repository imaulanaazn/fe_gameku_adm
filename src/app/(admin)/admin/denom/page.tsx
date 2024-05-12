"use client";

import TableDenom from "@/components/admin/Denom/TableDenom";
import Header from "@/components/admin/Header";
import { useEffect, useState } from "react";
import Loading from "./loading";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";

const Denom = () => {
  const [denoms, setDenoms] = useState<IProductPagination>();
  const [loading, setLoading] = useState(true);
  const getDenoms = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom", {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (req.ok) {
      setDenoms({ ...denoms, ...res });
    }

    setLoading(false);
  };

  useEffect(() => {
    getDenoms();
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
            {!loading && <>{denoms && <TableDenom denom={denoms} />}</>}
          </div>
        </>
      )}
    </>
  );
};

export default Denom;
