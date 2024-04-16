"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faArchive,
    faArrowDown,
    faArrowUp,
    faInfo,
    faInfoCircle,
    faPencil,
    faPlus,
    faRecycle,
    faSearch,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { productAdminState } from "@/atom/denomAdminState";
import Pagination from "../Pagination";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import Select from "react-select";
import ConfirmDelete from "../ConfirmDelete";
import FormDenom from "./FormDenom";
import { toast } from "react-toastify";

const column = [
    {
        id: "name",
        name: "Nama",
    },
    {
        id: "code",
        name: "Kode Produk",
    },
    {
        id: "priceBuy",
        name: "Harga Beli",
    },
    {
        id: "price",
        name: "Harga Jual",
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
        label: "Nama",
        value: "name",
    },
    {
        label: "Kode Produk",
        value: "code",
    },
];
const optionStatus = [
    {
        label: "Dipublikasikan",
        value: "active",
    },
    { label: "Diarsipkan", value: "archive" },
];

const TableDenom: React.FC<{ denom: IProductPagination }> = ({ denom }) => {
    const [optionGame, setOptionGame] = useState<{ label: string; value: string }[]>([]);
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
        order: denom.order,
        limit: denom.limit,
        page: denom.page,
        sort: denom.sort,
    });
    const [inputSearch, setInputSearch] = useState("");
    const [selectedOptionSearchBy, setSelectedOptionSearchBy] = useState<{ label: string; value: string }>(
        optionsSearchBy[0],
    );
    const [selectedOptionSearchByBefore, setSelectedOptionSearchByBefore] = useState<{
        key: string;
        value: string;
    } | null>(null);
    const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
        label: string;
        value: number;
    } | null>(null);
    const [selectedFilterGame, setSelectedFilterGame] = useState<{
        label: string;
        value: number;
    } | null>(null);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
        label: string;
        value: number;
    } | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [typeForm, setTypeForm] = useState("");
    const [detailData, setDetailData] = useState<IProductsGame | null>(null);

    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    const [denoms, setDenoms] = useRecoilState(productAdminState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getDenoms = async () => {
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setDenoms({ ...denoms, ...res });
        }

        setLoading(false);
    };

    const getGames = async () => {
        setLoading(true);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/attr", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setOptionGame(
                res.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                })),
            );
        }

        setLoading(false);
    };

    const setArchive = async (status: "active" | "archive") => {
        setLoading(true);

        const toastId = toast.loading(
            `Sedang  ${status === "active" ? "Menghapus dari arsip" : "Menambahkan ke arsip"} ...`,
        );
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom/archive", {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                productId: selected,
                status,
            }),
        });

        if (req.ok) {
            setSelected([]);
            getDenoms();
            toast.update(toastId, {
                render: `Berhasil ${status === "active" ? "Menghapus dari arsip" : "Menambahkan ke arsip"}`,
                type: "success",
                isLoading: false,
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

        setSelectedFilterLimit(null);
        setSelectedFilterGame(null);
    };

    useEffect(() => {
        getDenoms();
    }, [JSON.stringify(query), query.search.length]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelected(denoms.data.map((denom) => denom.id));
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
        setDenoms((prev) => ({
            ...prev,
            ...denom,
        }));
        setSelected([]);
        getGames();
    }, []);

    useEffect(() => {
        if (denoms.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [denoms.data.length, selected.length, selectAll]);

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
                        {optionGame.length > 0 && (
                            <Select
                                id="filterGame"
                                value={selectedFilterGame}
                                onChange={(e: any) => {
                                    const data = {
                                        key: "gameId",
                                        value: e.value,
                                    };
                                    setQuery((prev) => {
                                        const check = prev.search.find((item) => item.key === "gameId");
                                        if (check) {
                                            check.value = e.value;
                                        } else {
                                            prev.search.push(data);
                                        }

                                        prev.page = 1;

                                        return prev;
                                    });
                                    setSelectedFilterGame(e);
                                }}
                                options={optionGame}
                                placeholder="Filter Game"
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
                        )}
                        {optionStatus && (
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
            {showDelete && (
                <ConfirmDelete path={"/v1/denom/delete-bulk"} method={"DELETE"} getNewData={() => getDenoms()} />
            )}
            {showForm && (
                <FormDenom
                    handleShowForm={(value: boolean) => setShowForm(value)}
                    getNewData={getDenoms}
                    data={detailData || undefined}
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
                                <p className="text-xl font-semibold">Denom</p>
                            </div>
                        )}
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-green-600">{selected.length} Selected</p>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <div
                                            onClick={() => setArchive("archive")}
                                            className="bg-blue-800 hover:bg-blue-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-delete"
                                            data-tooltip-content="Tambahkan ke arsip"
                                        >
                                            <FontAwesomeIcon icon={faArchive} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-delete"
                                            style={{
                                                fontSize: "12px",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div
                                            onClick={() => setArchive("active")}
                                            className="bg-blue-800 hover:bg-blue-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-delete"
                                            data-tooltip-content="Hapus dari arsip"
                                        >
                                            <FontAwesomeIcon icon={faRecycle} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-delete"
                                            style={{
                                                fontSize: "12px",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div
                                            onClick={() => setShowDelete(true)}
                                            className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
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
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Terjual
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                                >
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {denoms.data.map((denom) => (
                                                <tr
                                                    key={denom.id}
                                                    onClick={() => handleRowSelect(denom.id)}
                                                    className={`${
                                                        selected.includes(denom.id)
                                                            ? "bg-gray-200"
                                                            : "bg-white hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                name={denom.id}
                                                                id={denom.id}
                                                                checked={selected.includes(denom.id)}
                                                                onChange={() => handleRowSelect(denom.id)}
                                                                className="h-4 w-4 cursor-pointer"
                                                            />
                                                            <label htmlFor="checkbox" className="sr-only">
                                                                Checkbox
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="h-10 aspect-square flex items-center">
                                                                <Image
                                                                    src={denom.logoDenom || denom.logoUrl || ""}
                                                                    alt={`Logo ${denom.name}`}
                                                                    width="0"
                                                                    height="0"
                                                                    sizes="100vw"
                                                                    style={{ width: "100%", height: "100%" }}
                                                                    className="rounded-lg object-contain"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p>{denom.name}</p>
                                                                <p className="text-xs text-gray-400">
                                                                    {denom.gameName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {denom.code}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {formatter(denom.priceBuy || 0)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {formatter(denom.price)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {denom.totalSold}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {denom.isActive ? "Dipublikasikan" : "Diarsipkan"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                        <div className="flex justify-end w-full">
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowForm(true);
                                                                    setTypeForm("detail");
                                                                    setDetailData(denom);
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
                        page={denoms.page}
                        limit={denoms.limit}
                        total={denoms.total}
                        totalPage={denoms.totalPage}
                    />
                </div>
            )}
        </>
    );
};

export default TableDenom;
