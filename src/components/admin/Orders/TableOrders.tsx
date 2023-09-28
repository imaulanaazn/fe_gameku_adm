"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPaginate from "react-paginate";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faInfoCircle, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { paymentMethodAdminState } from "@/atom/paymentMethodAdminState";
import { DiscountType, FeeType } from "@/enum";
import { IPromotion, IPromotionPagination } from "@/interfaces/promotion";
import { promoCodeAdminState } from "@/atom/promoCodeAdminState";
import dayjs from "dayjs";
import { orderHistoryState } from "@/atom/orderHistory";

const TableOrders: React.FC<{ data: IOrderHistoryState }> = ({ data }) => {
    const [promoCode, setPromoCode] = useRecoilState(orderHistoryState);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const setMsg = useSetRecoilState(msgState);
    const [showDelete, setShowDelete] = useState(false);
    const [valueConfirmDelete, setValueConfirmDelete] = useState("");
    const [loading, setLoading] = useState(false);

    const getPaymentsMethod = async (pagination: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        promoCode.keySearch && searchParams.append("name", promoCode.keySearch);
        pagination.page && searchParams.append("page", pagination.page.toString());
        searchParams.append("limit", promoCode.limit.toString());
        searchParams.append("order", promoCode.order);
        searchParams.append("sort", promoCode.sort);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/promo-code?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setPromoCode({ ...promoCode, ...res });
        }

        setLoading(false);
    };

    const activationBulk = async (activation: boolean) => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/payment-method/activation", {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                id: selectedRows,
                isActive: activation,
            }),
        });

        if (req.ok) {
            await getPaymentsMethod({
                page: promoCode.page,
            });
            setSelectedRows([]);
            setMsg({
                type: "success",
                time: 3,
                msg: activation ? "Berhasil Mengaktifkan Pembayaran" : "Berhasil Menonaktifkan Pembayaran",
            });
        } else {
            const res = await req.json();
            setMsg({ type: "error", time: 3, msg: `[${res.errorCode}] ${res.message}` });
        }
    };

    const handlePageClick = ({ selected }: { selected: any }) => {
        const page = selected + 1;
        getPaymentsMethod({ page });
        setPromoCode({
            ...promoCode,
            page,
        });
        setSelectAll(false);
        setSelectedRows([]);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows(promoCode.data.map((game) => game.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (gameId: string) => {
        if (selectedRows.includes(gameId)) {
            setSelectedRows(selectedRows.filter((id) => id !== gameId));
        } else {
            setSelectedRows([...selectedRows, gameId]);
        }
    };

    const handleSetActivation = (activation: boolean) => {
        activationBulk(activation);
    };

    useEffect(() => {
        setPromoCode({ ...promoCode, ...data });
        console.log(data);
    }, []);

    useEffect(() => {
        if (promoCode.data.length !== selectedRows.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [promoCode.data.length, selectedRows.length, selectAll]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto">
                    {selectedRows.length > 0 && (
                        <div className="flex space-x-3 justify-end my-1">
                            <div
                                onClick={() => handleSetActivation(true)}
                                className="px-4 py-2 bg-[#B72025] text-white font-semibold text-sm rounded-lg shadow-lg cursor-pointer"
                            >
                                Aktifkan ({selectedRows.length} items)
                            </div>
                            <div
                                onClick={() => handleSetActivation(false)}
                                className="px-4 py-2 bg-[#B72025] text-white font-semibold text-sm rounded-lg shadow-lg cursor-pointer"
                            >
                                Nonaktifkan ({selectedRows.length} items)
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-3 px-5">
                        <ReactPaginate
                            key={1}
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={promoCode.totalPage}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            forcePage={promoCode.page - 1}
                            containerClassName={"flex space-x-2 items-center"}
                            pageLinkClassName="font-semibold rounded-md px-3 py-2"
                            nextLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                            previousLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                            activeClassName={"bg-[#B72025] text-white font-semibold rounded-md py-2"}
                        />
                        <p className="text-sm font-montserrat">
                            Showing {(promoCode.page - 1) * promoCode.limit + 1} to{" "}
                            {Math.min(promoCode.page * promoCode.limit, promoCode.total)} of {promoCode.total} Results
                        </p>
                    </div>
                    <table className="w-full text-XS text-left text-gray-500 table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-white border-b-2 border-gray-300">
                            <tr>
                                <th scope="col" className="py-3 px-4">
                                    <input
                                        type="checkbox"
                                        name="selectAll"
                                        id="selectAll"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Denom
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    No. Whatsapp
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Jumlah
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Status
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Tanggal Pembelian
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCode.data.map((data) => (
                                <tr
                                    key={data.id}
                                    className={`${
                                        selectedRows.includes(data.id) ? "bg-gray-200" : "bg-white"
                                    } border-b dark:bg-gray-800 dark:border-gray-700`}
                                >
                                    <td className="w-10 text-center">
                                        <input
                                            type="checkbox"
                                            name={data.id}
                                            id={data.id}
                                            checked={selectedRows.includes(data.id)}
                                            onChange={() => handleRowSelect(data.id)}
                                        />
                                    </td>
                                    <td className="w-60 text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center">
                                        <div className="w-14 min-w-[3rem] h-12 object-cover bg-gray-200 p-2 rounded-lg">
                                            <Image
                                                src={data.logoUrl}
                                                alt={`Logo ${data.productName}`}
                                                width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: "100%", height: "100%" }}
                                                className="rounded-lg object-contain"
                                            />
                                        </div>
                                        <p className="text-xs">{data.productName}</p>
                                    </td>
                                    <td className="py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        <div className="flex justify-around w-full h-full">
                                            <div className="w-6 h-6 cursor-pointer bg-blue-600 rounded-full text-white flex justify-center items-center">
                                                <FontAwesomeIcon icon={faInfo} size="sm" />
                                            </div>
                                            <div className="w-6 h-6 cursor-pointer bg-yellow-600 rounded-full text-white flex justify-center items-center">
                                                <FontAwesomeIcon icon={faPencil} size="sm" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default TableOrders;
