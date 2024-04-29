"use client";

import Header from "@/components/admin/Header";
import TableUser from "@/components/admin/User/TableUser";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import TableReseller from "@/components/admin/Reseller/TableReseller";

const User = () => {
  const [data, setData] = useState<IUserPagination>();
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
          {/* <Header title="User" /> */}
          {data && <TableReseller user={data} />}
        </>
      )}
    </>
  );
};

export default User;
