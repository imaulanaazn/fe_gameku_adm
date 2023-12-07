"use client";

import { userState } from "@/atom/userState";
import formatter from "@/lib/formatter";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const HistoryTopup = () => {
    const [loading, setLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState<IOrderWithAnalitycsPagination | null>(null);
    const [page, setPage] = useState(1);
    const [user, setUser] = useRecoilState(userState);

    const getOrderHistory = async (pageNumber?: number) => {
        const result = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/v1/order-history?mobileNumber=" +
                user.mobileNumber +
                "&page=" +
                (pageNumber || page),
            {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                credentials: "include",
            },
        );

        const res = await result.json();
        if (result.ok) {
            setOrderHistory({ ...orderHistory, ...res });
        }
    };

    const checkStatus = (status: string) => {
        if (status === "1") {
            return "Belum Dibayar";
        } else if (status === "2") {
            return "Belum diproses game";
        } else if (status === "3") {
            return "Berhasil";
        } else if (status === "4") {
            return "Gagal";
        } else if (status === "5") {
            return "Kadaluarsa";
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
            <div className="flex flex-col items-center gap-3 my-10">
                <h1 className="font-pulse font-semibold text-2xl">History Topup</h1>
            </div>
            <div className="w-full rounded shadow relative">
                {isMobile && (
                    <div className="w-full rounded shadow">
                        {orderHistory &&
                            orderHistory.data.map((item, index) => (
                                <div className="bg-white text-black p-4 mb-2" key={index}>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>No:</strong>
                                        </div>
                                        <div>{index + 1}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>Kode Transaksi:</strong>
                                        </div>
                                        <div>{item.invoiceId}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>Produk:</strong>
                                        </div>
                                        <div>{item.game}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>Denom:</strong>
                                        </div>
                                        <div>{item.productName}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>Harga:</strong>
                                        </div>
                                        <div>{formatter(item.totalAmt)}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <strong>Status Pembayaran:</strong>
                                        </div>
                                        <div>{checkStatus(item.status)}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
                {!isMobile && (
                    <table className="w-full text-gray-600 text-sm">
                        <thead>
                            <tr className="bg-white">
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">No</th>
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                    Kode Transaksi
                                </th>
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">Produk</th>
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">Denom</th>
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">Harga</th>
                                <th className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                    Status Pembayaran
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderHistory &&
                                orderHistory.data.map((item, index) => (
                                    <tr className="bg-white" key={index}>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {index + 1}
                                        </td>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {item.invoiceId}
                                        </td>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {item.game}
                                        </td>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {item.productName}
                                        </td>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {formatter(item.totalAmt)}
                                        </td>
                                        <td className="py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 lg:py-4 lg:px-10">
                                            {checkStatus(item.status)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>

            {orderHistory && (
                <div className="w-full flex justify-center my-10">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        pageCount={orderHistory.totalPage ? parseInt(orderHistory.totalPage.toString()) : 1}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={3}
                        onPageChange={(e) => getOrderHistory(e.selected + 1)}
                        forcePage={orderHistory.totalPage - 1}
                        containerClassName={"flex space-x-2 items-center"}
                        pageLinkClassName="font-semibold rounded-md px-3 py-2"
                        nextLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                        previousLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                        activeClassName={"bg-[#B72025] text-white font-semibold rounded-md py-2"}
                    />
                </div>
            )}
        </>
    );
};

export default HistoryTopup;
