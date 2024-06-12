"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/global/loading/CompLoading";
import ConfirmDelete from "../ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import Pagination from "../Pagination";
import { INewsVideos, INewsVideosPagination } from "@/interfaces/newsVideo";
import { newsVideosAdminState } from "@/atom/newsVideosAdminState";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import FormYoutubeVideo from "./FormPosts";
import FormPosts from "./FormPosts";

const TablePosts: React.FC<{ data: INewsVideosPagination }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<INewsVideos | undefined>();

  const [newData, setNewData] = useRecoilState(newsVideosAdminState);
  const [selected, setSelected] = useRecoilState(selectedAdminState);
  const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

  const getNewData = async (pagination?: Partial<IPagination>) => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    newData.keySearch && searchParams.append("name", newData.keySearch);
    if (pagination && pagination.page) {
      searchParams.append("page", pagination.page.toString());
    } else {
      searchParams.append("page", newData.page.toString());
    }

    searchParams.append("limit", newData.limit.toString());
    searchParams.append("order", newData.order);
    searchParams.append("sort", newData.sort);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/youtube?" +
        searchParams.toString(),
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
      });
    }

    setLoading(false);
  };

  const handlePageClick = ({ selected }: { selected: any }) => {
    const page = selected + 1;
    getNewData({ page });
    setNewData({
      ...newData,
      page,
    });
    setSelectAll(false);
    setSelected([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelected(newData.data.map((item) => item.id));
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
    setNewData({ ...newData, ...data });
    setSelected([]);
  }, []);

  useEffect(() => {
    if (newData.data.length === selected.length && newData.data.length !== 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [newData.data.length, selected.length, selectAll]);

  return (
    <>
      {showForm && (
        <FormPosts
          handleShowForm={(value: boolean) => setShowForm(value)}
          getNewData={getNewData}
          type={typeForm}
          dataVideo={detailData}
        />
      )}
      {showDelete && (
        <ConfirmDelete
          path="/v1/youtube"
          method="DELETE"
          getNewData={getNewData}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded shadow overflow-x-scroll md:overflow-x-auto overflow-y-hidden">
          <div
            className={`p-5 ${
              selected.length > 0 ? "bg-green-200" : "bg-white"
            }`}
          >
            {selected.length === 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">Artikel</p>
                <div
                  onClick={() => {
                    setShowForm(!showForm);
                    setTypeForm("add");
                  }}
                  className="flex justify-between py-3 px-4 gap-5 items-center bg-green-600 hover:bg-green-500 text-white rounded-md cursor-pointer"
                >
                  <p>Artikel Baru</p>
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </div>
              </div>
            )}
            {selected.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold text-green-600">
                  {selected.length} Selected
                </p>
                <div>
                  <div className="relative">
                    <div
                      onClick={() => setShowDelete(true)}
                      className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center"
                      data-tooltip-id="tooltip-delete"
                      data-tooltip-content="Hapus"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="xl"
                        className="text-white"
                      />
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
                                !selectAll &&
                                selected.length > 0 &&
                                "appearance-none"
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Banner
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Author
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
                      {newData.data.map((data) => (
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
                            <div className="h-10 aspect-video flex items-center">
                              <Image
                                src={`https://img.youtube.com/vi/${data.videoId}/mqdefault.jpg`}
                                alt={`Banner Carousel`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            <Link
                              href={data.url}
                              target="_blank"
                              className="hover:text-blue-400"
                            >
                              {data.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            <Link
                              onClick={(e) => e.stopPropagation()}
                              href={data.authorUrl || "#"}
                              target="_blank"
                              className="hover:text-blue-400"
                            >
                              {data.author}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {data.url}
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
  );
};

export default TablePosts;
