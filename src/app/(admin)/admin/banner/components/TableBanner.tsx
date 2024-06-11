"use client";

import Select from "react-select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import {
  IImageCarousel,
  IImageCarouselPagination,
} from "@/interfaces/carousels";
import { carouselAdminState } from "@/atom/carouselAdminState";
import ConfirmDelete from "../../../../../components/admin/ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import { IActionBulk } from "@/interfaces/actionBulk";
import Pagination from "../../../../../components/admin/Pagination";
import FormAddBanner from "./FormAddBanner";
import { Tooltip as ReactTooltip } from "react-tooltip";
const column = [
  {
    id: "imageUrl",
    name: "Gambar",
  },
  {
    id: "name",
    name: "Nama",
  },
  {
    id: "eventUrl",
    name: "Event Url",
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

const TableBanner: React.FC<{ banner: IImageCarouselPagination }> = ({
  banner,
}) => {
  const [inputSearch, setInputSearch] = useState("");
  const [query, setQuery] = useState<{
    search: {
      key: string;
      value: string;
    }[];
    order: string;
    limit: number;
    page: number;
    sort: string;
  }>({
    search: [],
    order: banner.order,
    limit: banner.limit,
    page: banner.page,
    sort: banner.sort,
  });
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<IImageCarousel | undefined>();

  const [showFilter, setShowFilter] = useState(false);

  const [banners, setBanners] = useRecoilState(carouselAdminState);
  const [selected, setSelected] = useRecoilState(selectedAdminState);
  const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

  const getBanners = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    if (query.search.length > 0) {
      for (const item of query.search) {
        searchParams.append(item.key, item.value);
      }
    } else {
      searchParams.append("page", query.page.toString());
    }

    searchParams.append("limit", query.limit.toString());
    searchParams.append("order", query.order);
    searchParams.append("sort", query.sort);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/banner?" +
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
      setBanners({ ...banners, ...res });
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
  };

  useEffect(() => {
    setBanners({ ...banners, ...banner });
    setSelected([]);
  }, []);

  useEffect(() => {
    getBanners();
  }, [JSON.stringify(query), query.search.length]);

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
        <FormAddBanner
          handleShowForm={(value: boolean) => setShowForm(value)}
          getBanners={getBanners}
          type={typeForm}
          dataBanner={detailData}
        />
      )}
      {showDelete && (
        <ConfirmDelete
          path="/v1/banner"
          method="DELETE"
          getNewData={getBanners}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl overflow-x-scroll md:overflow-x-auto overflow-y-hidden p-6 lg:p-8">
          <div className="mb-4 flex flex-row justify-between items-center gap-4">
            <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
              Banner
            </h1>

            <div className="flex gap-6 lg:gap-8 items-center justify-between">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setTypeForm("add");
                }}
                className="shrink-0 flex justify-between py-2 px-3 md:py-3 md:px-4 gap-2 md:gap-4 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
              >
                <p>Banner Baru</p>
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative md:w-max w-full">
              <input
                type="text"
                placeholder="Cari Nama..."
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                className="peer inline-flex items-center w-full md:w-auto px-6 py-2 rounded-md gap-x-2 focus:bg-primary-50 text-primary-900 placeholder:text-primary-900 border-primary-900 focus:border-primary-900"
              />
              <button
                type="button"
                disabled={!inputSearch}
                onClick={(e) => handleClickSearch()}
                className="absolute top-1/2 right-3 -translate-y-1/2 peer-focus:bg-primary-50 h-[97%] w-auto aspect-square rounded-r-md"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-primary-900 text-lg"
                />
              </button>
            </div>

            <button
              className="flex justify-end items-center gap-2 text-primary-900 md:hidden w-full"
              onClick={() => {
                setShowFilter((prev) => !prev);
              }}
            >
              {showFilter ? "Close" : "Filter"}
              <FontAwesomeIcon icon={faFilter} />
            </button>

            <div
              className={`gap-4 items-center ${
                showFilter ? "flex" : "hidden md:flex"
              }`}
            >
              <div className="flex gap-2 items-center">
                {optionLimit && (
                  <div>
                    <Select
                      id="filterLimit"
                      value={selectedFilterLimit}
                      isSearchable={false}
                      onChange={(e: any) => {
                        setSelectedFilterLimit(e);
                        setQuery((prev) => {
                          return { ...prev, limit: e.value };
                        });
                      }}
                      options={optionLimit}
                      placeholder="Limit / Page"
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
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                          boxShadow: "none",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#b72025"
                            : "white",
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
                className="px-2 py-2 rounded-md text-primary-900 cursor-pointer"
              >
                Clear Filter
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
                <div className="overflow-hidden overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-100">
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
                        {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Gambar
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Nama
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Url Artikel
                                                </th> */}
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-right text-neutral-600 uppercase"
                        >
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {banners.data.map((banner) => (
                        <tr
                          key={banner.id}
                          onClick={() => handleRowSelect(banner.id)}
                          className={`${
                            selected.includes(banner.id)
                              ? "bg-gray-100"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          <td className="py-3 pl-4">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                name={banner.id}
                                id={banner.id}
                                checked={selected.includes(banner.id)}
                                onChange={() => handleRowSelect(banner.id)}
                                className="h-4 w-4 cursor-pointer"
                              />
                              <label htmlFor="checkbox" className="sr-only">
                                Checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="h-10 aspect-video flex items-center">
                              <Image
                                src={banner.imageUrl}
                                alt={`Banner Carousel Gasskeun Topup`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="rounded-md object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            <p>{banner.name}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {!banner.eventUrl ? <p>N/A</p> : banner.eventUrl}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="flex justify-end w-full">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowForm(true);
                                  setTypeForm("detail");
                                  setDetailData(banner);
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
            page={banners.page}
            limit={banners.limit}
            total={banners.total}
            totalPage={banners.totalPage}
          />
        </div>
      )}
    </>
  );
};

export default TableBanner;
