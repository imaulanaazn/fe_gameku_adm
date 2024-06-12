"use client";

import Header from "@/components/admin/Header";
import React, { useEffect, useState } from "react";
import Loading from "@/components/global/loading/CompLoading";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";
import TableUser from "@/components/admin/user/TableUser";

const User = () => {
  const [data, setData] = useState<IUserPagination>();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/user", {
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
          <div className="stats-wrapper pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12">
            {data && <TableUser user={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default User;
