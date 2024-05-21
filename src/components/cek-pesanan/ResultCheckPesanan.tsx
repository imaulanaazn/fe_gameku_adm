"use client";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { userOrderHistoryState } from "@/atom/userOrderHistory";
import ResultCekPesananTable from "./ResultCekPesananTable";

const ResultCheckPesanan = () => {
  const [orderHistory, setOrderHistory] = useRecoilState(userOrderHistoryState);
  const [page, setPage] = useState(1);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [disableContinues, setDisableContinues] = useState(true);
  const [haveData, setHaveData] = useState(false);

  const getOrderHistory = async (p: number) => {
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
    } else {
      toast.error(
        res.message ||
          "Kesalahan dalam mengambil riwayat transaksi, silahkan coba lagi",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
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
      <div className="w-full bg-white my-20 max-w-lg rounded-lg  py-10">
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
      <div className="w-full bg-white my-20 lg:my-24">
        <h1 className="text-neutral-800 text-2xl lg:text-3xl font-bold text-center">
          Riwayat Transaksi
        </h1>

        <ResultCekPesananTable orderHistory={orderHistory.data} />

        {/* Pagination */}

        <div className="flex justify-center text-black items-center gap-3">
          <div
            onClick={() => handleClick("previous")}
            className={`${
              disablePrevious
                ? "bg-slate-200 cursor-not-allowed text-slate-400"
                : "bg-red-100 text-primary-900 cursor-pointer hover:bg-primary-900 hover:text-white"
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
                ? "bg-slate-200 cursor-not-allowed text-slate-400"
                : "bg-red-100 text-primary-900 cursor-pointer hover:bg-primary-900 hover:text-white"
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
