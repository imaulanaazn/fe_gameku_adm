"use client";

import { gameAdminState } from "@/atom/gameAdminState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPaginate from "react-paginate";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faInfo, faInfoCircle, faPencil, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { productAdminState } from "@/atom/denomAdminState";
import ConfirmDelete from "../ConfirmDelete";
import Pagination from "../Pagination";
import ActionBulk from "../ActionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { IActionBulk } from "@/interfaces/actionBulk";
import { showDeleteState } from "@/atom/showDeleteState";

const TableDenom: React.FC<{ denom: IProductPagination }> = ({ denom }) => {
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const [denoms, setDenoms] = useRecoilState(productAdminState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getDenoms = async (pagination: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        denoms.keySearch && searchParams.append("name", denoms.keySearch);
        pagination.page && searchParams.append("page", pagination.page.toString());
        searchParams.append("limit", denoms.limit.toString());
        searchParams.append("order", denoms.order);
        searchParams.append("sort", denoms.sort);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/denom?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        console.log(res);
        if (req.ok) {
            setDenoms({ ...denoms, ...res });
        }

        setLoading(false);
    };

    const handlePageClick = ({ selected }: { selected: any }) => {
        const page = selected + 1;
        getDenoms({ page });
        setDenoms({
            ...denoms,
            page,
        });
        setSelectAll(false);
        setSelected([]);
    };

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
        setDenoms({ ...denoms, ...denom });
    }, []);

    useEffect(() => {
        const actionBulk = [
            {
                title: `Delete ${selected.length} items`,
                icon: faTrash,
                classActive: "bg-[#B72025] hover:bg-[#c5474c] text-white cursor-pointer",
                classNotAllowed: "bg-gray-300 text-gray-800 cursor-not-allowed",
                onClick() {
                    setShowDelete(selected.length > 0);
                },
            },
        ];

        setDataActionBulk(actionBulk);
    }, [selected.length]);

    useEffect(() => {
        if (denoms.data.length !== selected.length) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    }, [denoms.data.length, selected.length, selectAll]);

    useEffect(() => {
        console.log(denoms.page);
    }, [denoms.page]);

    return (
        <>
            {/* Task BE Delete Denom Bulk */}
            {showDelete && <ConfirmDelete path="/api/v1/denom/belumtapi ehehehe" method="PUT" field="productId" />}
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto mt-5">
                        <div className="flex justify-end my-1 gap-2">
                            <ActionBulk data={dataActionBulk} />
                            <div
                                // onClick={() => setShowForm(!showForm)}
                                className="py-3 rounded-md text-center px-4 bg-green-600 font-semibold text-white cursor-pointer"
                            >
                                Tambahkan Denom
                            </div>
                        </div>
                        <Pagination
                            onPageChange={handlePageClick}
                            page={denoms.page}
                            limit={denoms.limit}
                            total={denoms.total}
                            totalPage={denoms.totalPage}
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
                                        Game
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Harga
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Tipe
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Denom Unit
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Denom Bonus
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {denoms.data.map((denom) => (
                                    <tr
                                        key={denom.id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        <td className="w-10 text-center">
                                            <input
                                                type="checkbox"
                                                name={denom.id}
                                                id={denom.id}
                                                checked={selected.includes(denom.id)}
                                                onChange={() => handleRowSelect(denom.id)}
                                            />
                                        </td>
                                        <td className="w-60 text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center">
                                            <div className="w-12 min-w-[3rem] h-12 object-fill">
                                                <Image
                                                    src={denom.logoDenom}
                                                    alt={`Logo ${denom.name}`}
                                                    width="0"
                                                    height="0"
                                                    sizes="100vw"
                                                    style={{ width: "100%", height: "100%" }}
                                                    className="rounded-lg object-contain"
                                                />
                                            </div>
                                            <p className="text-xs">{denom.name}</p>
                                        </td>
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {denom.gameName}
                                        </td>
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {denom.price}
                                        </td>
                                        <td className="upper-case w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {denom.cd}
                                        </td>
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {denom.unit}
                                        </td>
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {denom.unitBonus || 0}
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
                </>
            )}
        </>
    );
};

export default TableDenom;
