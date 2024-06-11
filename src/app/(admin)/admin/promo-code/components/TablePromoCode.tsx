"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faInfo,
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import { DiscountType } from "@/enum";
import { IPromotion, IPromotionPagination } from "@/interfaces/promotion";
import { promoCodeAdminState } from "@/atom/promoCodeAdminState";
import dayjs from "dayjs";
import Pagination from "../../../../../components/admin/Pagination";
import ActionBulk from "../../../../../components/admin/ActionBulk";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import ConfirmDelete from "../../../../../components/admin/ConfirmDelete";
import FormAddPromoCode from "./FormAddPromoCode";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import Select from "react-select";

const column = [
  {
    id: "code",
    name: "Kode",
  },
  {
    id: "discountValue",
    name: "Potongan",
  },
  {
    id: "maxDiscount",
    name: "Max Potongan",
  },
  {
    id: "minPurchase",
    name: "Min Pembelian",
  },
  {
    id: "stock",
    name: "Total Stok",
  },
  {
    id: "usedStock",
    name: "Stok Digunakan",
  },
  {
    id: "startAt",
    name: "Tanggal Dimulai",
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
    label: "Nama Promo",
    value: "name",
  },
  {
    label: "Kode Promo",
    value: "code",
  },
];

const optionsFilterStatus = [
  { value: "active", label: "Aktif" },
  { value: "expired", label: "Kadaluarsa" },
];

const TablePromoCode: React.FC<{ data: IPromotionPagination }> = ({ data }) => {
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

  const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [detailData, setDetailData] = useState<IPromotion | undefined>();

  const [selected, setSelected] = useRecoilState(selectedAdminState);
  const [showDelete, setShowDelete] = useRecoilState(showDeleteState);
  const [promoCode, setPromoCode] = useRecoilState(promoCodeAdminState);

  const getPromotions = async () => {
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
        "/v1/promo-code?" +
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
      setPromoCode({
        data: res.data,
        keySearch: promoCode.keySearch,
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

    setSelectedFilterStatus(null);
    setSelectedFilterLimit(null);
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
    getPromotions();
  }, [JSON.stringify(query), query.search.length]);

  useEffect(() => {
    setPromoCode({ ...promoCode, ...data });
    setSelected([]);
  }, []);

  useEffect(() => {
    if (
      promoCode.data.length === selected.length &&
      promoCode.data.length !== 0
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [promoCode.data.length, selected.length, selectAll]);

  return (
    <>
      {showForm && (
        <FormAddPromoCode
          handleShowForm={(value: boolean) => setShowForm(value)}
          getNewData={getPromotions}
          dataPromotion={detailData}
          type={typeForm}
        />
      )}

      {showDelete && (
        <ConfirmDelete
          path="/v1/promo-code"
          method="DELETE"
          getNewData={getPromotions}
        />
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl overflow-x-scroll md:overflow-x-auto overflow-y-hidden p-6 lg:p-8">
          <h1 className="mb-4 font-medium text-xl md:text-2xl text-neutral-800">
            Banner
          </h1>

          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 w-full bg-white mb-4">
            <div className="flex gap-4 items-center">
              <div className="relative md:w-max w-full">
                <input
                  type="text"
                  placeholder={`${selectedOptionSearchBy.label}`}
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
                    backgroundColor: state.isFocused ? "#fff3f3" : "white",
                    boxShadow: "none",
                    minWidth: "10rem",
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

            <div className="flex gap-4">
              <Select
                id="filterStatus"
                value={selectedFilterStatus}
                isSearchable={false}
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
                options={optionsFilterStatus}
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
                    backgroundColor: state.isFocused ? "#fff3f3" : "white",
                    boxShadow: "none",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#b72025",
                    cursor: "pointer",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#b72025" : "white",
                    color: state.isSelected ? "white" : "#333",
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }),
                }}
              />
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
                        backgroundColor: state.isFocused ? "#fff3f3" : "white",
                        boxShadow: "none",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: "#b72025",
                        cursor: "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
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
                className="px-2 py-2 rounded-md text-primary-900 cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mb-4 flex justify-between items-center bg-primary-50 py-4 px-4 rounded-md">
              <h1 className="font-medium text-primary-900">
                {selected.length} items selected
              </h1>

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
                              className={`h-4 w-4 cursor-pointer absolute ${
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
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {promoCode.data.map((data) => (
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
                            <div>
                              <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                                {data.code}
                              </p>
                              <p className="text-xs text-gray-500 text-sm whitespace-nowrap">
                                {data.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.discountType === DiscountType.AMOUNT
                              ? formatter(data.discountValue)
                              : data.discountValue + " %"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.discountType === DiscountType.AMOUNT
                              ? formatter(data.discountValue)
                              : formatter(data.maxDiscount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatter(data.minPurchase)}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.stock}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.used}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {dayjs(data.startAt).format("YYYY-MM-DD HH:mm:ss")}
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                        {dayjs(data.endAt).format("YYYY-MM-DD HH:mm:ss")}
                                                    </td> */}
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="flex justify-end w-full">
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
            page={promoCode.page}
            limit={promoCode.limit}
            total={promoCode.total}
            totalPage={promoCode.totalPage}
          />
        </div>
      )}
    </>
  );
};

export default TablePromoCode;
