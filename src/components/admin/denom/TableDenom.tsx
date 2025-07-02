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
  faFilter,
  faFolderOpen,
  faInfo,
  faInfoCircle,
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faRecycle,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/global/loading/CompLoading";
import { productAdminState } from "@/atom/denomAdminState";
import Pagination from "@/components/admin/Pagination";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import Select from "react-select";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
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
  const [optionGame, setOptionGame] = useState<
    { label: string; value: string }[]
  >([]);
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
  const [showFilter, setShowFilter] = useState(false);

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
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom?" + searchParams.toString(),
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
      setDenoms({ ...denoms, ...res });
    }

    setLoading(false);
  };

  const getGames = async () => {
    setLoading(true);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/attr",
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
      setOptionGame(
        res.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }

    setLoading(false);
  };

  const setArchive = async (status: "active" | "archive") => {
    setLoading(true);

    const toastId = toast.loading(
      `Sedang  ${
        status === "active" ? "Menghapus dari arsip" : "Menambahkan ke arsip"
      } ...`
    );
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom/archive",
      {
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
      }
    );

    if (req.ok) {
      setSelected([]);
      getDenoms();
      toast.update(toastId, {
        render: `Berhasil ${
          status === "active" ? "Menghapus dari arsip" : "Menambahkan ke arsip"
        }`,
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

  console.log(detailData);

  return (
    <>
      {showDelete && (
        <ConfirmDelete
          path={"/v1/denom-bulk"}
          method={"DELETE"}
          getNewData={() => getDenoms()}
        />
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
        <div className="w-full bg-white rounded-xl p-6 lg:p-8">
          <div className="mb-4 flex flex-row justify-between items-center gap-4">
            <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
              Denom
            </h1>

            <div className="flex gap-6 lg:gap-8 items-center justify-between">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setTypeForm("add");
                }}
                className="shrink-0 flex justify-between py-2 px-3 md:py-3 md:px-4 gap-2 md:gap-4 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
              >
                <p>Tambah Denom</p>
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-between flex-wrap">
            <div className="flex gap-4">
              <div className="relative md:w-max w-full">
                <input
                  type="text"
                  placeholder={`${selectedOptionSearchBy.label}`}
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  className="peer inline-flex items-center w-full md:w-auto px-4 md:px-6 py-2 rounded-md gap-x-2 focus:bg-primary-50 text-primary-900 placeholder:text-primary-900 border-primary-900 focus:border-primary-900"
                />
                <button
                  type="button"
                  disabled={!inputSearch}
                  onClick={(e) => handleClickSearch()}
                  className="absolute top-1/2 right-1 md:right-3 -translate-y-1/2 peer-focus:bg-primary-50 h-[97%] w-auto aspect-square rounded-r-md"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-primary-900 text-lg"
                  />
                </button>
              </div>
              <div className="shrink-0">
                <Select
                  id="filterSearchBy"
                  value={selectedOptionSearchBy}
                  isSearchable={false}
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
            </div>

            <div className="flex justify-between md:hidden md:hidden w-full">
              <button
                className="flex-1 flex justify-start items-center gap-2 text-primary-900 "
                onClick={() => {
                  setShowFilter((prev) => !prev);
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                {showFilter ? "Close" : "Filter"}
              </button>
              {showFilter && (
                <button
                  onClick={() => handleClickClearButton()}
                  className="flex-1 py-2 rounded-md text-primary-900 cursor-pointer text-right"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div
              className={`filter w-full xl:w-max ${
                showFilter ? "flex flex-col md:flex-row" : "hidden md:flex"
              } gap-4 flex-wrap`}
            >
              {optionGame.length > 0 && (
                <div className="shrink-0">
                  <Select
                    id="filterGame"
                    value={selectedFilterGame}
                    isSearchable={true}
                    onChange={(e: any) => {
                      const data = {
                        key: "gameId",
                        value: e.value,
                      };
                      setQuery((prev) => {
                        const check = prev.search.find(
                          (item) => item.key === "gameId"
                        );
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
                        minWidth: "10rem",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: "#b72025",
                        cursor: "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        whiteSpace: "wrap",
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

              {optionStatus && (
                <div className="shrink-0">
                  <Select
                    id="filterStatus"
                    value={selectedFilterStatus}
                    onChange={(e: any) => {
                      const data = {
                        key: "status",
                        value: e.value,
                      };
                      setQuery((prev) => {
                        const check = prev.search.find(
                          (item) => item.key === "status"
                        );
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

              {optionLimit && (
                <div className="shrink-0">
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
                className="px-2 py-2 text-primary-900 cursor-pointer hidden md:inline-block"
              >
                Clear Filter
              </button>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="mt-4 flex justify-between items-center bg-primary-50 py-4 px-4 rounded-md">
              <h1 className="font-medium text-primary-900">
                {selected.length} items selected
              </h1>

              <div className="flex gap-4 items-center">
                <div className="relative">
                  <div
                    onClick={() => setArchive("archive")}
                    className="cursor-pointer"
                    data-tooltip-id="tooltip-delete"
                    data-tooltip-content="Tambahkan ke arsip"
                  >
                    <FontAwesomeIcon
                      icon={faArchive}
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
                <div className="relative">
                  <div
                    onClick={() => setArchive("active")}
                    className="cursor-pointer"
                    data-tooltip-id="tooltip-delete"
                    data-tooltip-content="Hapus dari arsip"
                  >
                    <FontAwesomeIcon
                      icon={faFolderOpen}
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
            </div>
          )}

          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto">
              <div className="w-full inline-block align-middle">
                <div className="overflow-hidden overflow-x-auto">
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
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
                        >
                          Terjual
                        </th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-right text-neutral-600 uppercase"
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
                              ? "bg-gray-100"
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
                          <td className="px-4 py-4">
                            <div className="flex gap-4 items-center">
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
                                <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                                  {denom.name}
                                </p>
                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                  {denom.gameName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {denom.code}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatter(denom.priceBuy || 0)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatter(denom.price)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {denom.totalSold}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {denom.isActive ? (
                              <span className="text-emerald-800 bg-emerald-100 block py-2 px-2 rounded-full text-center">
                                Dipublikasi
                              </span>
                            ) : (
                              <span className="text-gray-800 bg-gray-200 block py-2 px-2 rounded-full text-center">
                                Diarsipkan
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="flex justify-end w-full">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowForm(true);
                                  setTypeForm("detail");
                                  setDetailData(denom);
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
