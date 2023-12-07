"use client";

import { gameAdminState } from "@/atom/gameAdminState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faPlus,
    faSearch,
    faStar,
    faTimes,
    faTimesCircle,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import ConfirmDelete from "../ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import Pagination from "../Pagination";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import FormGame from "./FormGame";
import Select from "react-select";

const column = [
    {
        id: "name",
        name: "Nama",
    },
    {
        id: "categoryName",
        name: "Kategori",
    },
    {
        id: "type",
        name: "Tipe",
    },
    {
        id: "isPopular",
        name: "Populer",
    },
    {
        id: "slug",
        name: "Slug",
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

const optionCategory = [
    {
        label: "Game Mobile",
        value: "3478fb31-a9c0-42c1-ac17-7e8a5890b9d5",
    },
    {
        label: "Game PC",
        value: "87dc9cb8-28d0-45cd-a293-1b99b3047bd3",
    },
];

const optionType = [
    {
        label: "Topup",
        value: "topup",
    },
    {
        label: "Voucher",
        value: "voucher",
    },
];

const optionPopuler = [
    {
        label: "Populer",
        value: "true",
    },
    {
        label: "Tidak Populer",
        value: "false",
    },
];

const TableGame: React.FC<{ game: IGamePagination }> = ({ game }) => {
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
        order: game.order,
        limit: game.limit,
        page: game.page,
        sort: game.sort,
    });
    const [inputSearch, setInputSearch] = useState("");
    const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
        label: string;
        value: number;
    } | null>(null);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<{
        label: string;
        value: number;
    } | null>(null);
    const [selectedFilterType, setSelectedFilterType] = useState<{
        label: string;
        value: number;
    } | null>(null);
    const [selectedFilterPopular, setSelectedFilterPopular] = useState<{
        label: string;
        value: number;
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [typeForm, setTypeForm] = useState("");
    const [detailData, setDetailData] = useState<IGame | null>(null);

    const [games, setGames] = useRecoilState(gameAdminState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getGames = async () => {
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setGames({ ...games, ...res });
        }

        setLoading(false);
    };

    const setPopular = async (isPopular: boolean, newData: IGame[]) => {
        setLoading(true);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/popular-bulk", {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                gameId: selected,
                isPopular,
            }),
        });

        if (req.ok) {
            setGames({ ...games, data: newData });
            setSelected([]);
            toast.success(`Berhasil mengubah data game`, {
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

        setSelectedFilterLimit(null);
        setSelectedFilterCategory(null);
        setSelectedFilterPopular(null);
        setSelectedFilterType(null);
    };

    useEffect(() => {
        getGames();
    }, [JSON.stringify(query), query.search.length]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelected(games.data.map((game) => game.id));
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

    const handleSetBulkPopular = (isPopular: boolean) => {
        const duplicateGames = games.data.map((data) => ({ ...data }));
        const newData = duplicateGames.map((data) => {
            if (selected.includes(data.id)) {
                data.isPopular = isPopular;
            }

            return data;
        });
        setPopular(isPopular, newData);
    };

    useEffect(() => {
        setGames({ ...games, ...game });
        setSelected([]);
    }, []);

    useEffect(() => {
        if (games.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [games.data.length, selected.length, selectAll]);

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
                            id="default-search-game"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={`Cari berdasarkan Nama`}
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
                </div>
                <div className="flex mt-5 justify-between">
                    <div className="flex gap-3 ">
                        {optionCategory && (
                            <div>
                                <Select
                                    id="filterCategory"
                                    value={selectedFilterCategory}
                                    onChange={(e: any) => {
                                        const data = {
                                            key: "categoryId",
                                            value: e.value,
                                        };
                                        setQuery((prev) => {
                                            const check = prev.search.find((item) => item.key === "categoryId");
                                            if (check) {
                                                check.value = e.value;
                                            } else {
                                                prev.search.push(data);
                                            }

                                            prev.page = 1;

                                            return prev;
                                        });
                                        setSelectedFilterCategory(e);
                                    }}
                                    options={optionCategory}
                                    placeholder="Filter Kategori Game"
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
                        {optionType && (
                            <div>
                                <Select
                                    id="filterType"
                                    value={selectedFilterType}
                                    onChange={(e: any) => {
                                        const data = {
                                            key: "type",
                                            value: e.value,
                                        };
                                        setQuery((prev) => {
                                            const check = prev.search.find((item) => item.key === "type");
                                            if (check) {
                                                check.value = e.value;
                                            } else {
                                                prev.search.push(data);
                                            }

                                            prev.page = 1;

                                            return prev;
                                        });
                                        setSelectedFilterType(e);
                                    }}
                                    options={optionType}
                                    placeholder="Filter Tipe"
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
                        {optionPopuler && (
                            <div>
                                <Select
                                    id="filterPopular"
                                    value={selectedFilterPopular}
                                    onChange={(e: any) => {
                                        const data = {
                                            key: "isPopular",
                                            value: e.value,
                                        };
                                        setQuery((prev) => {
                                            const check = prev.search.find((item) => item.key === "isPopular");
                                            if (check) {
                                                check.value = e.value;
                                            } else {
                                                prev.search.push(data);
                                            }

                                            prev.page = 1;

                                            return prev;
                                        });
                                        setSelectedFilterPopular(e);
                                    }}
                                    options={optionPopuler}
                                    placeholder="Filter Populer"
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
            {showDelete && <ConfirmDelete path={"/v1/game"} method={"DELETE"} getNewData={() => getGames()} />}
            {showForm && (
                <FormGame
                    handleShowForm={(value: boolean) => setShowForm(value)}
                    getNewData={getGames}
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
                                <p className="text-xl font-semibold">Game</p>
                                <div
                                    onClick={() => {
                                        setShowForm(true);
                                        setTypeForm("add");
                                    }}
                                    className="flex justify-between py-3 px-4 gap-5 items-center bg-green-600 hover:bg-green-500 text-white rounded-md cursor-pointer"
                                >
                                    <p>Game Baru</p>
                                    <FontAwesomeIcon icon={faPlus} size="lg" />
                                </div>
                            </div>
                        )}
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-green-600">{selected.length} Selected</p>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <div
                                            onClick={() => handleSetBulkPopular(true)}
                                            className="bg-green-800 hover:bg-green-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-popular"
                                            data-tooltip-content="Tambahkan ke populer"
                                        >
                                            <FontAwesomeIcon icon={faStar} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-popular"
                                            style={{
                                                fontSize: "12px",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div
                                            onClick={() => handleSetBulkPopular(false)}
                                            className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center shadow"
                                            data-tooltip-id="tooltip-unpopular"
                                            data-tooltip-content="Hapus dari populer"
                                        >
                                            <FontAwesomeIcon icon={faTimesCircle} size="xl" className="text-white" />
                                        </div>
                                        <ReactTooltip
                                            id="tooltip-unpopular"
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
                                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                                >
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {games.data.map((game) => (
                                                <tr
                                                    key={game.id}
                                                    onClick={() => handleRowSelect(game.id)}
                                                    className={`${
                                                        selected.includes(game.id)
                                                            ? "bg-gray-200"
                                                            : "bg-white hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                name={game.id}
                                                                id={game.id}
                                                                checked={selected.includes(game.id)}
                                                                onChange={() => handleRowSelect(game.id)}
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
                                                                    src={game.logoUrl}
                                                                    alt={`Banner Carousel`}
                                                                    width="0"
                                                                    height="0"
                                                                    sizes="100vw"
                                                                    style={{ width: "100%", height: "100%" }}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                            </div>
                                                            <p>{game.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {game.categoryName}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {game.type === "voucher"
                                                            ? `${game.type} (${
                                                                  game.voucherType?.toUpperCase() || "EXTERNAL"
                                                              })`
                                                            : game.type}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {game.isPopular ? "Ya" : "Tidak"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {game.slug}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                        <div className="flex justify-end w-full">
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowForm(true);
                                                                    setTypeForm("detail");
                                                                    setDetailData(game);
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
                        page={games.page}
                        limit={games.limit}
                        total={games.total}
                        totalPage={games.totalPage}
                    />
                </div>
            )}
        </>
    );
};

export default TableGame;
