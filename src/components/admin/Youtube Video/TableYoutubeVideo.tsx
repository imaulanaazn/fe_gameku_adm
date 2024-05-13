"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faMagnifyingGlass,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import ConfirmDelete from "../ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import Pagination from "../Pagination";
import { INewsVideos, INewsVideosPagination } from "@/interfaces/newsVideo";
import { newsVideosAdminState } from "@/atom/newsVideosAdminState";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import FormYoutubeVideo from "./FormYoutubeVideo";
import Select from "react-select";
const column = [
  {
    id: "title",
    name: "Title",
  },
  {
    id: "author",
    name: "Author",
  },
  {
    id: "url",
    name: "Url",
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
    label: "Judul",
    value: "title",
  },
  {
    label: "Channel",
    value: "author",
  },
];

const TableYoutubeVideo: React.FC<{ data: INewsVideosPagination }> = ({
  data,
}) => {
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
  const [selectedOptionSearchBy, setSelectedOptionSearchBy] = useState<{
    label: string;
    value: string;
  }>(optionsSearchBy[0]);
  const [selectedOptionSearchByBefore, setSelectedOptionSearchByBefore] =
    useState<{
      key: string;
      value: string;
    } | null>(null);
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: number;
  } | null>(null);

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
    if (query.search.length > 0) {
      for (const item of query.search) {
        searchParams.append(item.key, item.value);
      }
    }

    searchParams.append("page", query.page.toString());
    searchParams.append("limit", query.limit.toString());
    searchParams.append("order", query.order);
    searchParams.append("sort", query.sort);
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
    setQuery((prev) => ({
      ...prev,
      page: selected + 1,
    }));
    setSelectAll(false);
    setSelected([]);
  };

  const handleClickSearch = () => {
    setQuery((prev) => {
      prev.search = prev.search.filter(
        (item) => item.key !== selectedOptionSearchByBefore?.key
      );
      const check = prev.search.findIndex(
        (item) => item.key === selectedOptionSearchBy.value
      );

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
    getNewData();
  }, [JSON.stringify(query), query.search.length]);

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
        <FormYoutubeVideo
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
        <div className="w-full bg-white rounded-xl p-8 overflow-x-scroll md:overflow-x-auto overflow-y-hidden">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-medium text-2xl text-neutral-800">
              Youtube Video
            </h1>
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setTypeForm("add");
              }}
              className="shrink-0 flex justify-between py-3 px-4 gap-5 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
            >
              <p>Link Youtube Baru</p>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>
          </div>

          <div className="flex gap-4 items-center justify-between flex-wrap">
            <div className="flex gap-4">
              <div className="relative w-max border border-primary-900 bg-primary-50 rounded-md overflow-hidden flex items-center">
                <input
                  placeholder={`Cari berdasarkan ${selectedOptionSearchBy.label}`}
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  className="w-full py-2 border-none bg-transparent text-primary-900 placeholder:text-primary-900 focus:ring-transparent"
                />
                <button
                  type="button"
                  disabled={!inputSearch}
                  onClick={(e) => handleClickSearch()}
                  className="pr-4 hover:cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-primary-900 text-lg"
                  />
                </button>
              </div>
              <Select
                id="filterSearchBy"
                value={selectedOptionSearchBy}
                onChange={(e: any) => {
                  const check = query.search.find(
                    (item) => item.key === selectedOptionSearchBy.value
                  );
                  if (check) {
                    setSelectedOptionSearchByBefore(check);
                  }
                  setSelectedOptionSearchBy(e);
                }}
                options={optionsSearchBy}
                placeholder="Cari Berdasarkan"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    color: "#b72025",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: "#b72025",
                    "&:hover": { color: "#b72025" },
                  }),
                  control: (provided, state) => ({
                    ...provided,
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    cursor: "pointer",
                    color: "#b72025",
                    borderColor: "#b72025",
                    "&:hover": { borderColor: "#b72025" },
                    borderRadius: "0.4rem",
                    backgroundColor: "#fff3f3",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#b72025",
                    cursor: "pointer",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    whiteSpace: "nowrap",
                    backgroundColor: state.isSelected ? "#b72025" : "white",
                    color: state.isSelected ? "white" : "#333",
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }),
                }}
              />
            </div>

            <div className="filter flex gap-4">
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
                      placeholder: (base) => ({
                        ...base,
                        color: "#b72025",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: "#b72025",
                        "&:hover": { color: "#b72025" },
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        cursor: "pointer",
                        color: "#b72025",
                        borderColor: "#b72025",
                        "&:hover": { borderColor: "#b72025" },
                        borderRadius: "0.4rem",
                        backgroundColor: "#fff3f3",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: "#b72025",
                        cursor: "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        whiteSpace: "nowrap",
                        backgroundColor: state.isSelected ? "#b72025" : "white",
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
              <button
                onClick={() => handleClickClearButton()}
                className="px-4 py-2 aspect-square rounded-md text-white bg-primary-900 hover:bg-red-600 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 flex justify-between items-center bg-primary-50 py-4 px-4 rounded-md">
              <h2 className="font-medium text-primary-900">
                {selected.length} items selected
              </h2>

              <div className="relative">
                <div
                  onClick={() => setShowDelete(true)}
                  className="cursor-pointer"
                  data-tooltip-id="tooltip-delete"
                  data-tooltip-content="Hapus"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="xl"
                    className="text-primary-900"
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
          )}

          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto">
              <div className="w-full inline-block align-middle">
                <div className="overflow-hidden">
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
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                        >
                          Thumbnail
                        </th>
                        {column.map((item) => (
                          <th
                            key={item.id}
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
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
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
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
                              ? "bg-gray-100"
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
                          <td className="px-4 py-4">
                            <div className="h-10 aspect-video flex items-center">
                              <Image
                                src={`https://img.youtube.com/vi/${data.videoId}/mqdefault.jpg`}
                                alt={`Banner Carousel`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="rounded-md object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800 text-sm">
                            <Link
                              onClick={(e) => e.stopPropagation()}
                              href={data.url}
                              target="_blank"
                              className="hover:text-blue-400"
                            >
                              {data.title}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <Link
                              onClick={(e) => e.stopPropagation()}
                              href={data.authorUrl || "#"}
                              target="_blank"
                              className="hover:text-blue-400"
                            >
                              {data.author}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {data.url}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="flex justify-start w-full">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowForm(true);
                                  setTypeForm("detail");
                                  setDetailData(data);
                                }}
                                className="bg-primary-900 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-600"
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

export default TableYoutubeVideo;
