"use client";
import TablePaymentMethod from "../../../../components/admin/payment-method/TablePaymentMethode";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";

const PaymentMethod = () => {
  const [data, setData] = useState<IPaymentMethodPagination>();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/payment-method",
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
            {!loading && <>{data && <TablePaymentMethod data={data} />}</>}
          </div>
        </>
      )}
    </>
  );
};

export default PaymentMethod;
