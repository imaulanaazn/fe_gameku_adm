"use client";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Statuses from "./Statuses";
import { toast } from "react-toastify";
import { userOrderHistoryState } from "@/atom/userOrderHistory";

const ResultCheckPesanan = () => {
  const [orderHistory, setOrderHistory] = useRecoilState(userOrderHistoryState);
  const [page, setPage] = useState(1);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [disableContinues, setDisableContinues] = useState(true);
  const [haveData, setHaveData] = useState(false);

  const getOrderHistory = async (p: number) => {
    const toastId = toast.loading("Mengecek pesanan...");
    const querySearch = orderHistory.keySearch + "&page=" + p;
    const result = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-history?" + querySearch,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    const res = await result.json();
    if (result.ok) {
      setOrderHistory((prev) => {
        const data = {
          ...prev,
          ...res,
        };

        return data;
      });
      toast.update(toastId, {
        render: "Berhasil mendapatkan riwayat transaksi",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render:
          res.message ||
          "Kesalahan dalam mengambil riwayat transaksi, silahkan coba lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleClick = (type: "continues" | "previous") => {
    if (
      (type === "previous" && disablePrevious) ||
      (type === "continues" && disableContinues)
    ) {
      return;
    }

    const newPage = type === "continues" ? page + 1 : page - 1;
    setPage(newPage);
    getOrderHistory(newPage);
  };

  useEffect(() => {
    if (orderHistory.page <= 1) {
      setDisablePrevious(true);
    } else {
      setDisablePrevious(false);
    }

    if (orderHistory.page >= orderHistory.totalPage) {
      setDisableContinues(true);
    } else {
      setDisableContinues(false);
    }
  }, [page, orderHistory.page, orderHistory.totalPage]);

  useEffect(() => {
    if (orderHistory.data.length > 0) {
      setHaveData(true);
    } else {
      setHaveData(false);
    }
  }, [JSON.stringify(orderHistory)]);

  useEffect(() => {
    setOrderHistory({
      data: [] as IOrder[],
      keySearch: "",
      limit: 10,
      order: "DESC",
      sort: "createdAt",
      page: 1,
    } as IOrderWithAnalitycsPaginationWithSearch);
  }, []);

  if (!haveData && orderHistory.keySearch) {
    return (
      <div className="w-full bg-white mt-5 max-w-lg rounded-lg  py-10">
        <h1 className="text-slate-600 text-xl font-bold">
          Tidak Ada Transaksi
        </h1>
        <p className="text-gray-600 text-sm">
          Silahkan Periksa kembali No. Transaksi atau No. Whatsapp
        </p>
      </div>
    );
  } else if (haveData) {
    return (
      <div className="w-full bg-white mt-5 rounded-lg p-3">
        <h1 className="text-black text-base font-bold mb-5">
          Riwayat Transaksi
        </h1>
        {orderHistory.data.map((data) => (
          <Link
            href={`/payment/${data.invoiceId}`}
            className="w-full border-2 p-3 flex justify-between items-center mb-3 border-black rounded-lg text-black hover:bg-slate-200"
            key={data.id}
          >
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16">
                <Image
                  src={data.logoUrl}
                  alt="Logo gasskeun Topup"
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: "100%", height: "100%" }}
                  className="rounded-lg"
                />
              </div>
              <div className="text-start lg:text-sm text-xs flex flex-col">
                <p>
                  {data.productName} <span>x</span> {data.quantity}
                </p>
                <p>{data.game}</p>
                <p>{data.paymentMethod}</p>
              </div>
            </div>
            <Statuses status={data.status} />
          </Link>
        ))}

        {/* Pagination */}

        <div className="flex justify-center text-black items-center gap-3">
          <div
            onClick={() => handleClick("previous")}
            className={`${
              disablePrevious
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-300 cursor-pointer"
            } w-7 h-7 flex justify-center items-center rounded-md`}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="1x" />
          </div>
          <div className="flex">
            <p>
              Page {page} of {orderHistory.totalPage}
            </p>
          </div>
          <div
            onClick={() => handleClick("continues")}
            className={`${
              disableContinues
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-300 cursor-pointer"
            } w-7 h-7 flex justify-center items-center rounded-md`}
          >
            <FontAwesomeIcon icon={faArrowRight} size="1x" />
          </div>
        </div>
      </div>
    );
  }
};

export default ResultCheckPesanan;
