"use client";

import { userState } from "@/atom/userState";
import formatter from "@/lib/formatter";
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const HistoryDeposit = () => {
  // const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] =
    useState<IOrderWithAnalitycsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [user, setUser] = useRecoilState(userState);

  // const prevPaginationBtn =
  //   page + 1 === 1
  //     ? "bg-slate-200 border-2 border-gray-200 rounded-md px-3 py-2 text-slate-400 cursor-not-allowed"
  //     : "bg-primary-100 border-2 border-primary-100 hover:border-primary-900 text-rose-700 rounded-md px-3 py-2 transition-all";
  // const nextPaginationBtn =
  //   page + 1 === totalPage
  //     ? "bg-slate-200 border-2 border-gray-200 rounded-md px-3 py-2 text-slate-400 cursor-not-allowed"
  //     : "bg-primary-100 border-2 border-primary-100 hover:border-primary-900 text-rose-700 rounded-md px-3 py-2 transition-all";

  const getOrderHistory = async (pageNumber?: number) => {
    const result = await fetch(
      `
      ${BASE_URL}/v1/user/orders?type=fund&page=${pageNumber || page}`,
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
      setOrderHistory({ ...orderHistory, ...res });
    }
  };

  const checkStatus = (status: string) => {
    if (status === "1") {
      return (
        <div className="py-1 px-3 lg:py-3 lg:px-4 text-sm font-medium bg-rose-100 text-rose-700 rounded-full">
          Belum Dibayar
        </div>
      );
    } else if (status === "2") {
      return (
        <div className="py-1 px-3 lg:py-3 lg:px-4 text-sm font-medium bg-sky-100 text-sky-700 rounded-full">
          Belum Diproses Game
        </div>
      );
    } else if (status === "3") {
      return (
        <div className="py-1 px-3 lg:py-3 lg:px-4 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-full">
          Berhasil
        </div>
      );
    } else if (status === "4") {
      return (
        <div className="py-1 px-3 lg:py-3 lg:px-4 text-sm font-medium bg-rose-100 text-rose-700 rounded-full ">
          Gagal
        </div>
      );
    } else if (status === "5") {
      return (
        <div className="py-1 px-3 lg:py-3 lg:px-4 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
          Kadaluarsa
        </div>
      );
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, [user]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-3 mt-10  mb-6 md:mt-12 lg:mt-6 xl:mb-10 ">
        <h1 className="font-semibold text-xl text-neutral-800">
          Riwayat Deposit
        </h1>
      </div>
      <div className="w-full">
        {isMobile && (
          <div className="w-full py-2">
            {orderHistory &&
              orderHistory.data.map((item, index) => (
                <div
                  className="bg-white text-black p-4 mb-4 rounded-xl shadow-md"
                  key={index}
                >
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-neutral-600 text-sm">No</p>
                    </div>
                    <div className="text-neutral-600 text-sm">{index + 1}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-neutral-600 text-sm">Kode Transaksi</p>
                    </div>
                    <div className="text-neutral-600 text-sm">
                      {item.invoiceId}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-neutral-600 text-sm">Produk</p>
                    </div>
                    <div className="text-neutral-600 text-sm">
                      Gasskeun Coin
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-neutral-600 text-sm">Harga</p>
                    </div>
                    <div className="text-neutral-600 text-sm">
                      {formatter(item.totalAmt)}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-neutral-600 text-sm">
                        Status Pembayaran
                      </p>
                    </div>
                    <div className="text-neutral-600 text-sm">
                      {checkStatus(item.status)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {!isMobile && (
          <table className="w-full text-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-3 lg:px-6 mb-4 text-neutral-700 xl:text-base">
                  No
                </th>
                <th className="font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-3 lg:px-6 mb-4 text-neutral-700 xl:text-base">
                  Kode Transaksi
                </th>
                <th className="font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-3 lg:px-6 mb-4 text-neutral-700 xl:text-base">
                  Produk
                </th>
                <th className="font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-3 lg:px-6 mb-4 text-neutral-700 xl:text-base">
                  Harga
                </th>
                <th className="font-medium py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-3 lg:px-6 mb-4 text-neutral-700 xl:text-base">
                  Status Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {orderHistory &&
                orderHistory.data.map((item, index) => (
                  <tr className="bg-white" key={index}>
                    <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-2 lg:px-6 text-neutral-500 xl:text-base">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-2 lg:px-6 text-neutral-500 xl:text-base">
                      {item.invoiceId}
                    </td>
                    <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-2 lg:px-6 text-neutral-500 xl:text-base">
                      Gasskeun Coin
                    </td>

                    <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-2 lg:px-6 text-neutral-500 xl:text-base">
                      {formatter(item.totalAmt)}
                    </td>
                    <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-4 lg:py-2 lg:px-6 text-neutral-500 xl:text-base">
                      {checkStatus(item.status)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {orderHistory && (
        <div className="w-full flex justify-center mt-6 md:mt-10 lg:mt-6">
          <ReactPaginate
            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
            breakLabel={"..."}
            pageCount={
              orderHistory.totalPage
                ? parseInt(orderHistory.totalPage.toString())
                : 1
            }
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={(e) => getOrderHistory(e.selected + 1)}
            forcePage={page - 1}
            containerClassName={"flex space-x-2 items-center"}
            pageLinkClassName="font-semibold rounded-md px-2 py-2"
            nextLinkClassName="bg-white border-2 border-gray-300 text-gray-500 rounded-md px-3 py-2"
            previousLinkClassName="bg-white border-2 border-gray-300 text-gray-500 rounded-md px-3 py-2"
            // nextLinkClassName={nextPaginationBtn}
            // previousLinkClassName={prevPaginationBtn}
            activeClassName={
              "bg-[#B72025] text-white font-semibold rounded-md p-2"
            }
          />
        </div>
      )}
    </>
  );
};

export default HistoryDeposit;
