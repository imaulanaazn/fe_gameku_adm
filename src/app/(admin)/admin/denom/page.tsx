"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/global/loading/CompLoading";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import TableDenom from "../../../../components/admin/denom/TableDenom";
import AdminHeader from "@/components/admin/AdminHeader";

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

  console.log(denoms);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AdminNavbar />
          <AdminHeader />
          <div className="stats-wrapper w-full pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            {!loading && <>{denoms && <TableDenom denom={denoms} />}</>}
          </div>
        </>
      )}
    </>
  );
};

export default Denom;
