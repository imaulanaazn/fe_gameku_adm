"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPaginate from "react-paginate";
import { msgState } from "@/atom/msgState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faInfo, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import { carouselAdminState } from "@/atom/carouselAdminState";
import ConfirmDelete from "../ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import ActionBulk from "../ActionBulk";
import { IActionBulk } from "@/interfaces/actionBulk";
import Pagination from "../Pagination";
import FormAddBanner from "./FormAddBanner";

const SEARCH_BY = [
    {
        id: "name",
        title: "Nama",
    },
];

const TableBanner: React.FC<{ banner: IImageCarouselPagination }> = ({ banner }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

    const [banners, setBanners] = useRecoilState(carouselAdminState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

    const getBanners = async (pagination?: Partial<IPagination>) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        banners.keySearch && searchParams.append("name", banners.keySearch);
        if (pagination && pagination.page) {
            searchParams.append("page", pagination.page.toString());
        } else {
            searchParams.append("page", banners.page.toString());
        }

        searchParams.append("limit", banners.limit.toString());
        searchParams.append("order", banners.order);
        searchParams.append("sort", banners.sort);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/banner?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setBanners({ ...banners, ...res });
        }

        setLoading(false);
    };

    const handlePageClick = ({ selected }: { selected: any }) => {
        const page = selected + 1;
        getBanners({ page });
        setBanners({
            ...banners,
            page,
        });
        setSelectAll(false);
        setSelected([]);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelected(banners.data.map((banner) => banner.id));
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
        setBanners({ ...banners, ...banner });
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
        if (banners.data.length === selected.length && banners.data.length !== 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [banners.data.length, selected.length, selectAll]);

    return (
        <>
            {showForm && (
                <FormAddBanner handleShowForm={(value: boolean) => setShowForm(value)} getBanners={getBanners} />
            )}
            {showDelete && <ConfirmDelete path="/api/v1/banner" method="DELETE" getNewData={getBanners} />}
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="w-full p-5 bg-white rounded-lg shadow-lg overflow-x-scroll md:overflow-x-auto mt-5">
                        <div className="flex justify-end my-1 gap-2">
                            <ActionBulk data={dataActionBulk} />
                            <div
                                onClick={() => setShowForm(!showForm)}
                                className="py-3 rounded-md text-center px-4 bg-green-600 font-semibold text-white cursor-pointer"
                            >
                                Tambahkan Banner
                            </div>
                        </div>
                        <Pagination
                            onPageChange={handlePageClick}
                            page={banners.page}
                            limit={banners.limit}
                            total={banners.total}
                            totalPage={banners.totalPage}
                        />
                        <table className="w-full text-xs text-left text-gray-500 table-auto">
                            <thead className="text-xs text-gray-700 uppercase bg-white border-b-2 border-gray-300">
                                <tr>
                                    <th scope="col" className="py-3 px-4">
                                        <input
                                            type="checkbox"
                                            name="selectAll"
                                            id="selectAll"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="cursor-pointer"
                                        />
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Gambar
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Nama
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Url Artikel
                                    </th>
                                    <th scope="col" className="py-3 px-4">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners.data.map((banner) => (
                                    <tr
                                        key={banner.id}
                                        className={`${
                                            selected.includes(banner.id) ? "bg-gray-200" : "bg-white hover:bg-gray-100"
                                        } border-b`}
                                    >
                                        <td className="w-10 text-center">
                                            <input
                                                type="checkbox"
                                                name={banner.id}
                                                id={banner.id}
                                                checked={selected.includes(banner.id)}
                                                onChange={() => handleRowSelect(banner.id)}
                                            />
                                        </td>
                                        <td className="w-72 h-fit text-ellipsis overflow-hidden py-4 font-medium px-4 text-gray-900 flex gap-3 items-center align-middle">
                                            <div className="w-full h-full flex items-center">
                                                <Image
                                                    src={banner.imageUrl}
                                                    alt={`Banner Carousel`}
                                                    width="0"
                                                    height="0"
                                                    sizes="100vw"
                                                    style={{ width: "100%", height: "100%" }}
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="min-w-fit overflow-hidden py-4 font-medium px-4 text-gray-900 text-xs">
                                            {banner.name}
                                        </td>
                                        <td className="overflow-hidden py-4 font-medium px-4 text-gray-900 text-xs">
                                            {banner.eventUrl === "#" || !banner.eventUrl ? "N/A" : banner.eventUrl}
                                        </td>
                                        <td className="py-4 font-medium px-4 text-gray-900 text-xs">
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

export default TableBanner;
