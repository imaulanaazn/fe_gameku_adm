"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { DiscountType } from "@/enum";
import { IPromotionPagination } from "@/interfaces/promotion";
import { promoCodeAdminState } from "@/atom/promoCodeAdminState";
import dayjs from "dayjs";
import Pagination from "../Pagination";
import ActionBulk from "../ActionBulk";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import ConfirmDelete from "../ConfirmDelete";
// import FormAddPromoCode from "./FormAddPromoCode";

const TableSocialMedia: React.FC<{ data: IPromotionPagination }> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);
    const [promoCode, setPromoCode] = useRecoilState(promoCodeAdminState);

    const getPromotions = async (pagination?: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        promoCode.keySearch && searchParams.append("name", promoCode.keySearch);
        if (pagination && pagination.page) {
            searchParams.append("page", pagination.page.toString());
        } else {
            searchParams.append("page", promoCode.page.toString());
        }
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

    const handlePageClick = ({ selected }: { selected: any }) => {
        const page = selected + 1;
        getPromotions({ page });
        setPromoCode({
            ...promoCode,
            page,
        });
        setSelectAll(false);
        setSelected([]);
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
        setPromoCode({ ...promoCode, ...data });
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
        ];

        setDataActionBulk(actionBulk);
    }, [selected.length]);

    useEffect(() => {
        if (promoCode.data.length === selected.length && promoCode.data.length !== 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [promoCode.data.length, selected.length, selectAll]);

    return (
        <>
            {/* {showForm && (
                <FormAddPromoCode handleShowForm={(value: boolean) => setShowForm(value)} getNewData={getPromotions} />
            )} */}
            {showDelete && <ConfirmDelete path="/api/v1/promo-code" method="DELETE" getNewData={getPromotions} />}
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto">
                    <div className="flex justify-end my-1 gap-2">
                        <ActionBulk data={dataActionBulk} />
                        <div
                            onClick={() => setShowForm(!showForm)}
                            className="py-3 rounded-md text-center px-4 bg-green-600 font-semibold text-white cursor-pointer"
                        >
                            Tambahkan Kode Promo
                        </div>
                    </div>
                    <Pagination
                        onPageChange={handlePageClick}
                        page={promoCode.page}
                        limit={promoCode.limit}
                        total={promoCode.total}
                        totalPage={promoCode.totalPage}
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
                                    Kode
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Potongan
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Tanggal Dimulai
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Tanggal Selesai
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Min Pembelian
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
                                    <td className="w-60 text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <p className="text-xs">{data.code}</p>
                                    </td>
                                    {data.discountType === DiscountType.AMOUNT ? (
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(data.discountValue)}
                                        </td>
                                    ) : (
                                        <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                            {data.discountValue} %
                                        </td>
                                    )}
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {dayjs(data.startAt).format("YYYY-MM-DD HH:mm:ss")}
                                    </td>
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {dayjs(data.endAt).format("YYYY-MM-DD HH:mm:ss")}
                                    </td>
                                    <td className="w-28 overflow-hidden py-4 font-medium px-4 text-gray-900 whitespace-nowrap dark:text-white text-xs">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(data.minPurchase)}
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

export default TableSocialMedia;
