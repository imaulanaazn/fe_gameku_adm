"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPaginate from "react-paginate";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faCheckCircle,
    faCircleXmark,
    faInfo,
    faInfoCircle,
    faPencil,
    faPlus,
    faSearch,
    faTimes,
    faTimesCircle,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { paymentMethodAdminState } from "@/atom/paymentMethodAdminState";
import { FeeType } from "@/enum";
import Pagination from "../Pagination";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import ActionBulk from "../ActionBulk";
import { toast } from "react-toastify";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import ConfirmDelete from "../ConfirmDelete";
import { showDeleteState } from "@/atom/showDeleteState";
import FormPaymentMethod from "./FormPaymentMethod";
import Select from "react-select";
import { IPromotion } from "@/interfaces/promotion";
const column = [
    {
        id: "name",
        name: "Nama",
    },
    {
        id: "isActive",
        name: "Status",
    },
    {
        id: "fee",
        name: "Fee",
    },
    {
        id: "minAmount",
        name: "Min Pembelian",
    },
    {
        id: "maxAmount",
        name: "Max Pembelian",
    },
];
const optionLimit = [
    {
        label: "10",
        value: 10,
    },
    {
        label: "20",
        value: 20,
    },
    {
        label: "30",
        value: 30,
    },
    {
        label: "40",
        value: 40,
    },
    {
        label: "50",
        value: 50,
    },
    {
        label: "100",
        value: 100,
    },
];
const optionStatus = [
    {
        label: "Aktif",
        value: true,
    },
    {
        label: "Tidak Aktif",
        value: false,
    },
];
const optionPaymentCategory = [
    {
        label: "E Wallet",
        value: "1",
    },
    {
        label: "QRIS",
        value: "2",
    },
    {
        label: "Virtual Account",
        value: "3",
    },
    {
        label: "Retail",
        value: "4",
    },
];

const TablePaymentMethod: React.FC<{ data: IPaymentMethodPagination }> = ({ data }) => {
    const [inputSearch, setInputSearch] = useState("");
    const [query, setQuery] = useState<{
        search: {
            key: string;
            value: string;
        }[];
        order: string;
        limit: number;
        page: number;
        sort: string;
    }>({
        search: [],
        order: data.order,
        limit: data.limit,
        page: data.page,
        sort: data.sort,
    });

    const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
        label: string;
        value: string;
    } | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [typeForm, setTypeForm] = useState("");
    const [detailData, setDetailData] = useState<IPaymentMethod | undefined>();

    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [paymentsMethod, setPaymentsMethod] = useRecoilState(paymentMethodAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getPaymentsMethod = async () => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (query.search.length > 0) {
            for (const item of query.search) {
                searchParams.append(item.key, item.value);
            }
        }

        searchParams.append("page", query.page.toString());
        searchParams.append("limit", query.limit.toString());
        searchParams.append("order", query.order);
        searchParams.append("sort", query.sort);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/payment-method?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setPaymentsMethod({ ...paymentsMethod, ...res });
        }

        setLoading(false);
    };

    const activationBulk = async (activation: boolean) => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/payment-method/activation", {
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
            await getPaymentsMethod();
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
        setQuery((prev) => ({
            ...prev,
            page: selected + 1,
        }));
        setSelectAll(false);
        setSelected([]);
    };

    const handleClickSearch = () => {
        setQuery((prev) => {
            const check = prev.search.findIndex((item) => item.key === "name");
            if (check !== -1) {
                prev.search[check].value = inputSearch;
            } else {
                prev.search.push({
                    key: "name",
                    value: inputSearch,
                });
            }

            prev.page = 1;

            return { ...prev };
        });
    };

    const handleClickClearButton = () => {
        setQuery((prev) => ({
            ...prev,
            page: 1,
            search: [],
        }));

        setSelectedPaymentCategory(null);
        setSelectedFilterStatus(null);
        setSelectedFilterLimit(null);
    };

    useEffect(() => {
        getPaymentsMethod();
    }, [JSON.stringify(query), query.search.length]);

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
        if (paymentsMethod.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [paymentsMethod.data.length, selected.length, selectAll]);

    return (
        <>
            <div className="w-full bg-white rounded shadow p-5">
                <div className="relative w-1/2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Cari Voucher..."
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                    />
                    <button
                        type="button"
                        disabled={!inputSearch}
                        onClick={(e) => handleClickSearch()}
                        className={`${
                            !inputSearch ? "bg-gray-400 text-black cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                        } text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2`}
                    >
                        Cari
                    </button>
                </div>
                <div className="flex justify-between items-center mt-5">
                    <div className="flex gap-2 items-center">
                        {optionStatus && (
                            <div>
                                <Select
                                    id="filterStatus"
                                    value={selectedFilterStatus}
                                    onChange={(e: any) => {
                                        const data = {
                                            key: "is_active",
                                            value: e.value,
                                        };
                                        setQuery((prev) => {
                                            const check = prev.search.find((item) => item.key === "is_active");
                                            if (check) {
                                                check.value = e.value;
                                            } else {
                                                prev.search.push(data);
                                            }

                                            prev.page = 1;

                                            return prev;
                                        });
                                        setSelectedFilterStatus(e);
                                    }}
                                    options={optionStatus}
                                    placeholder="Filter Status"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            cursor: "pointer",
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: "#333",
                                            cursor: "pointer",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? "#007BFF" : "white",
                                            color: state.isSelected ? "white" : "#333",
                                            cursor: "pointer",
                                            ":hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }),
                                    }}
                                />
                            </div>
                        )}
                        {optionPaymentCategory && (
                            <div>
                                <Select
                                    id="filterPaymentCategory"
                                    value={selectedPaymentCategory}
                                    onChange={(e: any) => {
                                        const data = {
                                            key: "category",
                                            value: e.value,
                                        };
                                        setQuery((prev) => {
                                            const check = prev.search.find((item) => item.key === "category");
                                            if (check) {
                                                check.value = e.value;
                                            } else {
                                                prev.search.push(data);
                                            }
                                            prev.page = 1;
                                            return prev;
                                        });
                                        setSelectedPaymentCategory(e);
                                    }}
                                    options={optionPaymentCategory}
                                    placeholder="Filter Kategori"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            cursor: "pointer",
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: "#333",
                                            cursor: "pointer",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? "#007BFF" : "white",
                                            color: state.isSelected ? "white" : "#333",
                                            cursor: "pointer",
                                            ":hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }),
                                    }}
                                />
                            </div>
                        )}
                        {optionLimit && (
                            <div>
                                <Select
                                    id="filterLimit"
                                    value={selectedFilterLimit}
                                    onChange={(e: any) => {
                                        setSelectedFilterLimit(e);
                                        setQuery((prev) => {
                                            return { ...prev, limit: e.value };
                                        });
                                    }}
                                    options={optionLimit}
                                    placeholder="Limit PerPage"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            cursor: "pointer",
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: "#333",
                                            cursor: "pointer",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? "#007BFF" : "white",
                                            color: state.isSelected ? "white" : "#333",
                                            cursor: "pointer",
                                            ":hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }),
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleClickClearButton()}
                        className="h-12 aspect-square rounded-md text-white bg-blue-700 hover:bg-blue-800 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
            {showForm && detailData && (
                <FormPaymentMethod
                    handleShowForm={(value: boolean) => setShowForm(value)}
                    getNewData={() => console.log}
                    data={detailData}
                    type={typeForm}
                />
            )}
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full bg-white rounded shadow overflow-x-scroll md:overflow-x-auto overflow-y-hidden mt-5">
                    <div className={`p-5 ${selected.length > 0 ? "bg-green-200" : "bg-white"}`}>
                        {selected.length === 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold">Metode Pembayaran</p>
                            </div>
                        )}
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-green-600">{selected.length} Selected</p>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <div
                                            onClick={() => handleSetActivation(true)}
                                            className="bg-green-800 hover:bg-green-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-activated"
                                            data-tooltip-content="Aktifkan"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-activated"
                                            style={{
                                                fontSize: "12px",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div
                                            onClick={() => handleSetActivation(false)}
                                            className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-diactivated"
                                            data-tooltip-content="Nonaktifkan"
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-diactivated"
                                            style={{
                                                fontSize: "12px",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="w-full inline-block align-middle">
                                <div className="overflow-hidden px-5">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3 pl-4">
                                                    <div className="flex items-center h-5 relative">
                                                        <input
                                                            type="checkbox"
                                                            name="selectAll"
                                                            id="selectAll"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                            className={`h-4 w-4 absolute cursor-pointer ${
                                                                !selectAll && selected.length > 0 && "appearance-none"
                                                            }`}
                                                        />
                                                        {!selectAll && selected.length > 0 && (
                                                            <div className="h-4 w-4 bg-gray-400 flex items-center justify-center">
                                                                <div className="w-2 h-1 bg-gray-200"></div>
                                                            </div>
                                                        )}

                                                        <label htmlFor="checkbox" className="sr-only">
                                                            Checkbox
                                                        </label>
                                                    </div>
                                                </th>
                                                {column.map((item) => (
                                                    <th
                                                        key={item.id}
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        <div
                                                            className="flex gap-3 cursor-pointer items-center"
                                                            onClick={() =>
                                                                setQuery((prev) => ({
                                                                    ...prev,
                                                                    sort: item.id,
                                                                    order:
                                                                        query.sort === item.id && query.order === "ASC"
                                                                            ? "DESC"
                                                                            : "ASC",
                                                                }))
                                                            }
                                                        >
                                                            <p>{item.name}</p>
                                                            {query.sort === item.id && (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        query.order === "ASC" ? faArrowUp : faArrowDown
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                                >
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paymentsMethod.data.map((data) => (
                                                <tr
                                                    key={data.id}
                                                    onClick={() => handleRowSelect(data.id)}
                                                    className={`${
                                                        selected.includes(data.id)
                                                            ? "bg-gray-200"
                                                            : "bg-white hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                name={data.id}
                                                                id={data.id}
                                                                checked={selected.includes(data.id)}
                                                                onChange={() => handleRowSelect(data.id)}
                                                                className="h-4 w-4 cursor-pointer"
                                                            />
                                                            <label htmlFor="checkbox" className="sr-only">
                                                                Checkbox
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="h-10 aspect-square flex items-center">
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
                                                            <p>{data.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {data.isActive ? "Aktif" : "Tidak Aktif"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {data.feeType === FeeType.AMOUNT && formatter(data.fee)}
                                                        {data.feeType !== FeeType.AMOUNT && data.fee + " %"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {formatter(data.minAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {formatter(data.maxAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-right">
                                                        <div className="flex justify-end w-full">
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowForm(true);
                                                                    setTypeForm("detail");
                                                                    setDetailData(data);
                                                                }}
                                                                className="bg-green-600 px-4 py-2 rounded-md text-white cursor-pointer"
                                                            >
                                                                Lihat
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination
                        onPageChange={handlePageClick}
                        page={paymentsMethod.page}
                        limit={paymentsMethod.limit}
                        total={paymentsMethod.total}
                        totalPage={paymentsMethod.totalPage}
                    />
                </div>
            )}
        </>
    );
};

export default TablePaymentMethod;
