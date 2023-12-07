"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faInfo,
    faPencil,
    faPlus,
    faSearch,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { DiscountType } from "@/enum";
import { IPromotion, IPromotionPagination } from "@/interfaces/promotion";
import { promoCodeAdminState } from "@/atom/promoCodeAdminState";
import dayjs from "dayjs";
import Pagination from "../Pagination";
import ActionBulk from "../ActionBulk";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import ConfirmDelete from "../ConfirmDelete";
import FormAddPromoCode from "./FormAddPromoCode";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import Select from "react-select";

const column = [
    {
        id: "code",
        name: "Kode",
    },
    {
        id: "discountValue",
        name: "Potongan",
    },
    {
        id: "maxDiscount",
        name: "Max Potongan",
    },
    {
        id: "minPurchase",
        name: "Min Pembelian",
    },
    {
        id: "stock",
        name: "Total Stok",
    },
    {
        id: "usedStock",
        name: "Stok Digunakan",
    },
    {
        id: "startAt",
        name: "Tanggal Dimulai",
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
        label: "Nama Promo",
        value: "name",
    },
    {
        label: "Kode Promo",
        value: "code",
    },
];

const optionsFilterStatus = [
    { value: "active", label: "Aktif" },
    { value: "expired", label: "Kadaluarsa" },
];

const TablePromoCode: React.FC<{ data: IPromotionPagination }> = ({ data }) => {
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

    const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
        label: string;
        value: number;
    } | null>(null);

    const [typeForm, setTypeForm] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [detailData, setDetailData] = useState<IPromotion | undefined>();

    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);
    const [promoCode, setPromoCode] = useRecoilState(promoCodeAdminState);

    const getPromotions = async () => {
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/promo-code?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setPromoCode({
                data: res.data,
                keySearch: promoCode.keySearch,
                order: res.order,
                limit: res.limit,
                page: res.page,
                sort: res.sort,
                total: res.total,
                totalPage: res.totalPage,
            });
        }

        setLoading(false);
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
        setSelectedFilterLimit(null);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelected(promoCode.data.map((game) => game.id));
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

    useEffect(() => {
        getPromotions();
    }, [JSON.stringify(query), query.search.length]);

    useEffect(() => {
        setPromoCode({ ...promoCode, ...data });
        setSelected([]);
    }, []);

    useEffect(() => {
        if (promoCode.data.length === selected.length && promoCode.data.length !== 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [promoCode.data.length, selected.length, selectAll]);

    return (
        <>
            <div className="w-full bg-white rounded shadow p-5 mt-5">
                <div className="w-1/2 flex gap-3 items-center">
                    <div className="w-3/4 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <input
                            type="search"
                            id="default-search-promoCode"
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
                <FormAddPromoCode
                    handleShowForm={(value: boolean) => setShowForm(value)}
                    getNewData={getPromotions}
                    dataPromotion={detailData}
                    type={typeForm}
                />
            )}
            {showDelete && <ConfirmDelete path="/v1/promo-code" method="DELETE" getNewData={getPromotions} />}
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full bg-white rounded shadow overflow-x-scroll md:overflow-x-auto overflow-y-hidden mt-5">
                    <div className={`p-5 ${selected.length > 0 ? "bg-green-200" : "bg-white"}`}>
                        {selected.length === 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold">Kode Promo</p>
                                <div
                                    onClick={() => {
                                        setShowForm(!showForm);
                                        setTypeForm("add");
                                    }}
                                    className="flex justify-between py-3 px-4 gap-5 items-center bg-green-600 hover:bg-green-500 text-white rounded-md cursor-pointer"
                                >
                                    <p>Kode Promo Baru</p>
                                    <FontAwesomeIcon icon={faPlus} size="lg" />
                                </div>
                            </div>
                        )}
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-green-600">{selected.length} Selected</p>
                                <div>
                                    <div className="relative">
                                        <div
                                            onClick={() => setShowDelete(true)}
                                            className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center"
                                            data-tooltip-id="tooltip-delete"
                                            data-tooltip-content="Hapus"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-delete"
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
                                <div className="overflow-hidden overflow-x-auto px-5">
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
                                                            className={`h-4 w-4 cursor-pointer absolute ${
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
                                            {promoCode.data.map((data) => (
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
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                        <div>
                                                            <p className="font-bold">{data.code}</p>
                                                            <p className="text-xs">{data.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {data.discountType === DiscountType.AMOUNT
                                                            ? formatter(data.discountValue)
                                                            : data.discountValue + " %"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {data.discountType === DiscountType.AMOUNT
                                                            ? formatter(data.discountValue)
                                                            : formatter(data.maxDiscount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {formatter(data.minPurchase)}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {data.stock}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {data.used}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {dayjs(data.startAt).format("YYYY-MM-DD HH:mm:ss")}
                                                    </td>
                                                    {/* <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {dayjs(data.endAt).format("YYYY-MM-DD HH:mm:ss")}
                                                    </td> */}
                                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
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
                        page={promoCode.page}
                        limit={promoCode.limit}
                        total={promoCode.total}
                        totalPage={promoCode.totalPage}
                    />
                </div>
            )}
        </>
    );
};

export default TablePromoCode;
