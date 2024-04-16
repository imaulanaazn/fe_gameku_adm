"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
    faArrowDown,
    faArrowUp,
    faCheckCircle,
    faMoneyBill,
    faSearch,
    faShoppingCart,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { orderHistoryState } from "@/atom/orderHistory";
import DisplayTotal from "../Dashboard/DisplayTotal";
import Pagination from "../Pagination";
import formatter from "@/lib/formatter";
import StatusesOrder from "@/components/global/StatusesOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormOrders from "./FormOrders";
const column = [
    {
        id: "game",
        name: "Game",
    },
    {
        id: "totalAmt",
        name: "Total",
    },
    {
        id: "status",
        name: "Status",
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

const optionsSearchBy = [
    {
        label: "Nomor Transaksi",
        value: "invoiceId",
    },
    {
        label: "Denom",
        value: "productName",
    },
    {
        label: "Nomor Whatsapp",
        value: "mobileNumber",
    },
    {
        label: "Akun",
        value: "custName",
    },
];

const optionsFilterDate = [
    { value: "all", label: "Semua" },
    { value: "today", label: "Hari Ini" },
    { value: "yesterday", label: "Kemarin" },
    { value: "lastWeek", label: "Seminggu yang Lalu" },
    { value: "lastMonth", label: "Sebulan yang Lalu" },
    { value: "custom", label: "Custom" },
];

const optionsFilterStatus = [
    { value: "1", label: "Belum Dibayar" },
    { value: "2", label: "Belum Diproses" },
    { value: "3", label: "Berhasil" },
    { value: "4", label: "Gagal" },
    { value: "5", label: "Kadaluarsa" },
    { value: "6", label: "Sedang Diproses" },
];

const TableOrders: React.FC<{ data: IOrderWithAnalitycsPaginationWithDetail }> = ({ data }) => {
    const datePickerRef = useRef<DatePicker>(null);
    const [query, setQuery] = useState<{
        search: {
            key: string;
            value: any;
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
    const [inputSearch, setInputSearch] = useState("");
    const [selectedOptionSearchBy, setSelectedOptionSearchBy] = useState<{ label: string; value: string }>(
        optionsSearchBy[0],
    );
    const [selectedOptionSearchByBefore, setSelectedOptionSearchByBefore] = useState<{
        key: string;
        value: string;
    } | null>(null);

    const [selectedOptionDate, setSelectedOptionDate] = useState<{
        label: string;
        value: string;
    } | null>(null);

    const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
        label: string;
        value: number;
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [typeForm, setTypeForm] = useState("");
    const [detailData, setDetailData] = useState<IOrderHistoryWithDetail | undefined>();

    const [newData, setNewData] = useRecoilState(orderHistoryState);

    const getNewData = async () => {
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/orders?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setNewData({
                data: res.data,
                keySearch: newData.keySearch,
                order: res.order,
                limit: res.limit,
                page: res.page,
                sort: res.sort,
                total: res.total,
                totalPage: res.totalPage,
                analytics: res.analytics,
            });
        }

        setLoading(false);
    };

    const handlePageClick = ({ selected }: { selected: any }) => {
        setQuery((prev) => ({
            ...prev,
            page: selected + 1,
        }));
    };

    const handleClickSearch = () => {
        setQuery((prev) => {
            prev.search = prev.search.filter((item) => item.key !== selectedOptionSearchByBefore?.key);
            const check = prev.search.findIndex((item) => item.key === selectedOptionSearchBy.value);

            if (check !== -1) {
                prev.search[check].value = inputSearch;
            } else {
                prev.search.push({
                    key: selectedOptionSearchBy.value,
                    value: inputSearch,
                });
            }

            prev.page = 1;

            return { ...prev };
        });
    };

    const handleClickClearButton = () => {
        setQuery((prev) => {
            return {
                ...prev,
                page: 1,
                search: [],
                limit: 10,
            };
        });

        setSelectedFilterStatus(null);
        setSelectedOptionDate(null);
        setSelectedFilterLimit(null);
    };

    useEffect(() => {
        if (selectedOptionDate) {
            let date: { startDate: string; endDate: string } = {
                startDate: "",
                endDate: "",
            };
            if (selectedOptionDate.value === "today") {
                const today = dayjs();
                date.startDate = today.startOf("day").toISOString();
                date.endDate = today.endOf("day").toISOString();
            } else if (selectedOptionDate.value === "yesterday") {
                const yesterday = dayjs().subtract(1, "day");
                date.startDate = yesterday.startOf("day").toISOString();
                date.endDate = yesterday.endOf("day").toISOString();
            } else if (selectedOptionDate.value === "lastWeek") {
                const endDate = dayjs();
                const startDate = endDate.subtract(7, "day");
                date.startDate = startDate.startOf("day").toISOString();
                date.endDate = endDate.endOf("day").toISOString();
            } else if (selectedOptionDate.value === "lastMonth") {
                const endDate = dayjs();
                const startDate = endDate.subtract(1, "month");
                date.startDate = startDate.startOf("day").toISOString();
                date.endDate = endDate.endOf("day").toISOString();
            } else if (selectedOptionDate.value === "custom") {
                if (datePickerRef.current) {
                    datePickerRef.current.setOpen(true);
                }
            }

            if (selectedOptionDate.value !== "custom") {
                setQuery((prev) => {
                    const check = prev.search.findIndex((item) => item.key === "start");
                    const check2 = prev.search.findIndex((item) => item.key === "end");

                    if (check !== -1 && check2 !== -1) {
                        prev.search[check].value = date.startDate;
                        prev.search[check2].value = date.endDate;
                    } else {
                        prev.search.push({
                            key: "start",
                            value: date.startDate,
                        });
                        prev.search.push({
                            key: "end",
                            value: date.endDate,
                        });
                    }

                    prev.page = 1;

                    return { ...prev };
                });
            }
        }
    }, [selectedOptionDate?.label, selectedOptionDate?.value]);

    useEffect(() => {
        getNewData();
    }, [JSON.stringify(query), query.search.length]);

    useEffect(() => {
        setNewData({ ...newData, ...data });
    }, []);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const onChange = (dates: any) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        if (startDate && endDate) {
            setQuery((prev) => {
                const check = prev.search.findIndex((item) => item.key === "start");
                const check2 = prev.search.findIndex((item) => item.key === "end");

                if (check !== -1 && check2 !== -1) {
                    prev.search[check].value = dayjs(startDate).startOf("day").toISOString();
                    prev.search[check2].value = dayjs(endDate).endOf("day").toISOString();
                } else {
                    prev.search.push({
                        key: "start",
                        value: dayjs(startDate).startOf("day").toISOString(),
                    });
                    prev.search.push({
                        key: "end",
                        value: dayjs(endDate).endOf("day").toISOString(),
                    });
                }

                prev.page = 1;

                return { ...prev };
            });
        }
    }, [startDate, endDate]);

    return (
        <>
            <div>
                <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    selectsRange
                    dropdownMode="select"
                    minDate={new Date(2000, 0, 1)}
                    maxDate={new Date(2100, 11, 31)}
                    withPortal
                    customInput={<input type="hidden" />}
                    ref={datePickerRef}
                />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                <DisplayTotal
                    title="Pesanan"
                    value={data.analytics.orders}
                    valueBefore={0}
                    icon={faShoppingCart}
                    bgColorIcon="bg-blue-400"
                />
                <DisplayTotal
                    title="Pendapatan"
                    value={data.analytics.revenue}
                    valueBefore={0}
                    icon={faMoneyBill}
                    bgColorIcon="bg-green-400"
                    isCurrency={true}
                />
                <DisplayTotal
                    title="Pesanan Berhasil"
                    value={data.analytics.countPaid}
                    valueBefore={0}
                    icon={faCheckCircle}
                    bgColorIcon="bg-green-400"
                />
            </div>
            <div className="w-full bg-white rounded shadow p-5 mt-5">
                <div className="w-1/2 flex gap-3 items-center">
                    <div className="w-3/4 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={`Cari berdasarkan ${selectedOptionSearchBy.label}`}
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                        />
                        <button
                            type="button"
                            disabled={!inputSearch}
                            onClick={(e) => handleClickSearch()}
                            className={`${
                                !inputSearch
                                    ? "bg-gray-400 text-black cursor-not-allowed"
                                    : "bg-blue-700 hover:bg-blue-800"
                            } text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2`}
                        >
                            Cari
                        </button>
                    </div>
                    <Select
                        id="filterSearchBy"
                        value={selectedOptionSearchBy}
                        onChange={(e: any) => {
                            const check = query.search.find((item) => item.key === selectedOptionSearchBy.value);
                            if (check) {
                                setSelectedOptionSearchByBefore(check);
                            }
                            setSelectedOptionSearchBy(e);
                        }}
                        options={optionsSearchBy}
                        placeholder="Cari Berdasarkan"
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
                <div className="flex mt-5 justify-between">
                    <div className="flex gap-3 ">
                        <Select
                            id="filterDate"
                            value={selectedOptionDate}
                            onChange={(e: any) => {
                                setSelectedOptionDate(e);
                            }}
                            options={optionsFilterDate}
                            placeholder="Filter Tanggal"
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
                        <Select
                            id="filterStatus"
                            value={selectedFilterStatus}
                            onChange={(e: any) => {
                                const data = {
                                    key: "status",
                                    value: e.value,
                                };
                                setQuery((prev) => {
                                    const check = prev.search.find((item) => item.key === "status");
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
                            options={optionsFilterStatus}
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
            {showForm && (
                <FormOrders
                    handleShowForm={(value: boolean) => setShowForm(value)}
                    getNewData={getNewData}
                    data={detailData}
                    type={typeForm}
                />
            )}
            <>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="w-full bg-white rounded shadow overflow-y-hidden mt-5">
                        <div className={`p-5 bg-white`}>
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold">Pesanan</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <div className="w-full inline-block align-middle">
                                    <div className="overflow-hidden px-5">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
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
                                                                            query.sort === item.id &&
                                                                            query.order === "ASC"
                                                                                ? "DESC"
                                                                                : "ASC",
                                                                    }))
                                                                }
                                                            >
                                                                <p>{item.name}</p>
                                                                {query.sort === item.id && (
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            query.order === "ASC"
                                                                                ? faArrowUp
                                                                                : faArrowDown
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                    ))}
                                                    {/* <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Denom
                                                    </th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Akun
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        No. Whatsapp
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Kuantitas
                                                    </th>
                                                    {/* <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Total
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Status
                                                    </th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                                    >
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {newData.data.map((data) => (
                                                    <tr key={data.id} className={`bg-white`}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                            <div className="flex gap-3 items-center">
                                                                <div className="h-10 aspect-square flex items-center">
                                                                    <Image
                                                                        src={data.logoUrl}
                                                                        alt={`Logo Game`}
                                                                        width="0"
                                                                        height="0"
                                                                        sizes="100vw"
                                                                        style={{ width: "100%", height: "100%" }}
                                                                        className="rounded-lg object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-base">{data.game}</p>
                                                                    <p>{data.productName}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">
                                                            {formatter(data.totalAmt)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">
                                                            <StatusesOrder value={data.status} />
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">
                                                            {data.custName}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">
                                                            {data.mobileNumber}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">
                                                            {data.quantity}
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
                            page={newData.page}
                            limit={newData.limit}
                            total={newData.total}
                            totalPage={newData.totalPage}
                        />
                    </div>
                )}
            </>
        </>
    );
};

export default TableOrders;
