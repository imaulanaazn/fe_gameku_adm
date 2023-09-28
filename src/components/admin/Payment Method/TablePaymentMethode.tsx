"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPaginate from "react-paginate";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faInfo,
    faInfoCircle,
    faPencil,
    faTimes,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { paymentMethodAdminState } from "@/atom/paymentMethodAdminState";
import { FeeType } from "@/enum";
import Pagination from "../Pagination";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import ActionBulk from "../ActionBulk";
import { toast } from "react-toastify";

const TablePaymentMethod: React.FC<{ data: IPaymentMethodPagination }> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const setMsg = useSetRecoilState(msgState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [paymentsMethod, setPaymentsMethod] = useRecoilState(paymentMethodAdminState);

    const getPaymentsMethod = async (pagination: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        paymentsMethod.keySearch && searchParams.append("name", paymentsMethod.keySearch);
        pagination.page && searchParams.append("page", pagination.page.toString());
        searchParams.append("limit", paymentsMethod.limit.toString());
        searchParams.append("order", paymentsMethod.order);
        searchParams.append("sort", paymentsMethod.sort);
        const req = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/payment-method?" + searchParams.toString(),
            {
                cache: "no-cache",
                method: "GET",
                credentials: "include",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            },
        );

        const res = await req.json();
        if (req.ok) {
            setPaymentsMethod({ ...paymentsMethod, ...res });
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
                id: selected,
                isActive: activation,
            }),
        });

        if (req.ok) {
            await getPaymentsMethod({
                page: paymentsMethod.page,
            });
            setSelected([]);
            toast.success(activation ? "Berhasil Mengaktifkan Pembayaran" : "Berhasil Menonaktifkan Pembayaran", {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            const res = await req.json();
            toast.error(`[${res.errorCode}] ${res.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handlePageClick = ({ selected }: { selected: any }) => {
        const page = selected + 1;
        getPaymentsMethod({ page });
        setPaymentsMethod({
            ...paymentsMethod,
            page,
        });
        setSelectAll(false);
        setSelected([]);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelected(paymentsMethod.data.map((game) => game.id));
        } else {
            setSelected([]);
        }
    };

    const handleRowSelect = (gameId: string) => {
        if (selected.includes(gameId)) {
            setSelected(selected.filter((id) => id !== gameId));
        } else {
            setSelected([...selected, gameId]);
        }
    };

    const handleSetActivation = (activation: boolean) => {
        activationBulk(activation);
    };

    useEffect(() => {
        setPaymentsMethod({ ...paymentsMethod, ...data });
    }, []);

    useEffect(() => {
        const actionBulk = [
            {
                title: `Aktifkan ${selected.length} items`,
                icon: faCheckCircle,
                classActive: "bg-green-600 hover:bg-green-500 text-white cursor-pointer",
                classNotAllowed: "bg-gray-300 text-gray-800 cursor-not-allowed",
                onClick() {
                    handleSetActivation(true);
                },
            },
            {
                title: `Nonaktifkan ${selected.length} items`,
                icon: faTimesCircle,
                classActive: "bg-yellow-600 hover:bg-yellow-500 text-white cursor-pointer",
                classNotAllowed: "bg-gray-300 text-gray-800 cursor-not-allowed",
                onClick() {
                    handleSetActivation(false);
                },
            },
        ];

        setDataActionBulk(actionBulk);
    }, [selected.length]);

    useEffect(() => {
        if (paymentsMethod.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [paymentsMethod.data.length, selected.length, selectAll]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto">
                    <div className="flex justify-end my-1 gap-2">
                        <ActionBulk data={dataActionBulk} />
                    </div>
                    <Pagination
                        onPageChange={handlePageClick}
                        page={paymentsMethod.page}
                        limit={paymentsMethod.limit}
                        total={paymentsMethod.total}
                        totalPage={paymentsMethod.totalPage}
                    />
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
                                    Nama
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Status
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Fee
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Min Amount
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Max Amount
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsMethod.data.map((data) => (
                                <tr
                                    key={data.id}
                                    className={`${
                                        selected.includes(data.id) ? "bg-gray-200" : "bg-white"
                                    } border-b dark:bg-gray-800 dark:border-gray-700`}
                                >
                                    <td className="w-10 text-center">
                                        <input
                                            type="checkbox"
                                            name={data.id}
                                            id={data.id}
                                            checked={selected.includes(data.id)}
                                            onChange={() => handleRowSelect(data.id)}
                                        />
                                    </td>
                                    <td className="w-60 text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center">
                                        <div className="w-14 min-w-[3rem] h-12 object-cover bg-gray-200 p-2 rounded-lg">
                                            <Image
                                                src={data.logo}
                                                alt={`Logo ${data.name}`}
                                                width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: "100%", height: "100%" }}
                                                className="rounded-lg object-contain"
                                            />
                                        </div>
                                        <p className="text-xs">{data.name}</p>
                                    </td>
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {data.isActive ? "Aktif" : "Tidak Aktif"}
                                    </td>
                                    {data.feeType === FeeType.AMOUNT ? (
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(data.fee)}
                                        </td>
                                    ) : (
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {data.fee} %
                                        </td>
                                    )}
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(data.minAmount)}
                                    </td>
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(data.maxAmount)}
                                    </td>
                                    <td className="py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        <div className="flex flex-row gap-2 w-full h-full">
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

export default TablePaymentMethod;
