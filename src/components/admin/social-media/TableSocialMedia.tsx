"use client";

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
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ISocialMedia, ISocialMediaPagination } from "@/interfaces/socialMedia";
import { socialMediaAdminState } from "@/atom/socialMediaState";
import ButtonSocialMedia from "@/components/global/footer/ButtonSocialMedia";
import dayjs from "dayjs";
import FormSocialMedia from "./FormSocialMedia";
import * as brands from "@fortawesome/free-brands-svg-icons";
import Select from "react-select";
const column = [
  {
    id: "name",
    name: "Nama",
  },
  {
    id: "icon",
    name: "Tombol",
  },
  {
    id: "url",
    name: "Url Media Sosial",
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

const TableSocialMedia: React.FC<{ data: ISocialMediaPagination }> = ({
  data,
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
    order: data.order,
    limit: data.limit,
    page: data.page,
    sort: data.sort,
  });
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<ISocialMedia | undefined>();
  const [svgBrandsIcon, setSvgBrandsIcon] = useState<any>({});

  const [newData, setNewData] = useRecoilState(socialMediaAdminState);
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
        "/v1/sosmed?" +
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

    const newDataBrands = { ...brands } as any;
    delete newDataBrands.prefix;
    delete newDataBrands.fab;

    setSvgBrandsIcon(newDataBrands);
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
        <FormSocialMedia
          handleShowForm={(value: boolean) => setShowForm(value)}
          getNewData={getNewData}
          type={typeForm}
          dataSocialMedia={detailData}
        />
      )}
      {showDelete && (
        <ConfirmDelete
          path="/v1/sosmed"
          method="DELETE"
          getNewData={getNewData}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
              Social Media
            </h1>
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setTypeForm("add");
              }}
              className="shrink-0 flex justify-between py-3 px-4 gap-5 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
            >
              <p>Social Media Baru</p>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>
          </div>

          <div className="flex gap-4 items-center justify-between flex-wrap mt-4">
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
                className="absolute top-1/2 right-3 -translate-y-1/2 peer-focus:bg-primary-50 h-[90%] w-auto aspect-square rounded-r-md"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-primary-900 text-lg"
                />
              </button>
            </div>

            <div className="flex gap-4 items-center justify-end flex-wrap w-full md:w-max">
              {optionLimit && (
                <div className="w-full md:w-max">
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
                        boxShadow: "none",
                        backgroundColor: state.isFocused ? "#fff3f3" : "white",
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
                className="px-2 py-2 text-primary-900 cursor-pointer  self-end"
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="p-4 bg-slate-100">
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
                              className="flex gap-4 cursor-pointer items-center"
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
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
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
                          <td className="px-4 py-4 font-medium text-gray-800 text-sm whitespace-nowrap">
                            {data.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            <div className="h-10 aspect-video flex items-center w-full">
                              <ButtonSocialMedia
                                icon={svgBrandsIcon[data.icon]}
                                title={data.name}
                                to={data.url || "#"}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {data.url ? (
                              <p className="text-sm text-gray-500 whitespace-nowrap">
                                {data.url}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 whitespace-nowrap">
                                N/A
                              </p>
                            )}
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

export default TableSocialMedia;
