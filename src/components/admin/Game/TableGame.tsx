"use client";

import { gameAdminState } from "@/atom/gameAdminState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPencil, faStar, faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import ConfirmDelete from "../ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import { IActionBulk } from "@/interfaces/actionBulk";
import ActionBulk from "../ActionBulk";
import Pagination from "../Pagination";
import { toast } from "react-toastify";

const TableGame: React.FC<{ game: IGamePagination }> = ({ game }) => {
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const [games, setGames] = useRecoilState(gameAdminState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getGames = async (pagination: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        games.keySearch && searchParams.append("name", games.keySearch);
        pagination.page && searchParams.append("page", pagination.page.toString());
        searchParams.append("limit", games.limit.toString());
        searchParams.append("order", games.order);
        searchParams.append("sort", games.sort);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/game?" + searchParams.toString(), {
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/game/popular-bulk", {
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
        const page = selected + 1;
        getGames({ page });
        setGames({
            ...games,
            page,
        });
        setSelectAll(false);
        setSelected([]);
    };

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
        const actionBulk = [
            {
                title: `Delete ${selected.length} items`,
                icon: faTrash,
                classActive: "bg-[#B72025] hover:bg-[#c5474c] text-white cursor-pointer",
                classNotAllowed: "bg-[#B72025] text-white opacity-50",
                onClick() {
                    setShowDelete(selected.length > 0);
                },
            },
            {
                title: `Set Populer ${selected.length} items`,
                icon: faStar,
                classActive: "bg-blue-600 hover:bg-blue-400 text-white cursor-pointer",
                classNotAllowed: "bg-blue-600 text-white opacity-50",
                onClick() {
                    handleSetBulkPopular(true);
                },
            },
            {
                title: `Set Tidak Populer ${selected.length} items`,
                icon: faTimesCircle,
                classActive: "bg-[#B72025] hover:bg-[#c5474c] text-white cursor-pointer",
                classNotAllowed: "bg-[#B72025] text-white opacity-50",
                onClick() {
                    handleSetBulkPopular(false);
                },
            },
        ];

        setDataActionBulk(actionBulk);
    }, [selected.length]);

    useEffect(() => {
        if (games.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [games.data.length, selected.length, selectAll]);

    return (
        <>
            {showDelete && (
                <ConfirmDelete
                    path={"/api/v1/game/delete-bulk"}
                    method={"PUT"}
                    field="gameId"
                    getNewData={() => getGames({ page: games.page })}
                />
            )}
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto">
                    <div className="flex justify-end my-1 gap-2">
                        <ActionBulk data={dataActionBulk} />
                        <div
                            // onClick={() => setShowForm(!showForm)}
                            className="py-3 rounded-md text-center px-4 bg-green-600 font-semibold text-white cursor-pointer"
                        >
                            Tambahkan Game
                        </div>
                    </div>
                    <Pagination
                        onPageChange={handlePageClick}
                        page={games.page}
                        total={games.total}
                        totalPage={games.totalPage}
                        limit={games.limit}
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
                                    Kategori
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Tipe
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Populer
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Slug
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.data.map((game) => (
                                <tr key={game.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="w-10 text-center">
                                        <input
                                            type="checkbox"
                                            name={game.id}
                                            id={game.id}
                                            checked={selected.includes(game.id)}
                                            onChange={() => handleRowSelect(game.id)}
                                        />
                                    </td>
                                    <td className="w-60 text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center">
                                        <div className="w-12 min-w-[3rem] h-12 object-cover">
                                            <Image
                                                src={game.logoUrl}
                                                alt={`Logo ${game.name}`}
                                                width="0"
                                                height="0"
                                                sizes="100vw"
                                                style={{ width: "100%", height: "100%" }}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <p className="text-xs">{game.name}</p>
                                    </td>
                                    <td className="w-28 overflow-hidden uppercase py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {game.categoryName}
                                    </td>
                                    <td className="w-36 overflow-hidden uppercase py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {game.type === "voucher" ? `${game.type} (${game.voucherType})` : game.type}
                                    </td>
                                    <td className="w-36 uppercase py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {game.isPopular ? "Ya" : "Tidak"}
                                    </td>
                                    <td className="py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {game.slug}
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

export default TableGame;
