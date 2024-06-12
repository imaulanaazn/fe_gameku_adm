"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  faArrowDown,
  faArrowUp,
  faCheckCircle,
  faFilter,
  faMagnifyingGlass,
  faMoneyBill,
  faSearch,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/global/loading/CompLoading";
import { orderHistoryState } from "@/atom/orderHistory";
import DisplayTotal from "../dashboard/DisplayTotal";
import Pagination from "../Pagination";
import formatter from "@/lib/formatter";
import StatusesOrder from "@/components/global/StatusesOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
const column = [
  {
    id: "totalAmt",
    name: "Total",
  },
  {
    id: "status",
    name: "Status",
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
    label: "Nomor Transaksi",
    value: "invoiceId",
  },
  {
    label: "Denom",
    value: "productName",
  },
  {
    label: "Nomor Whatsapp",
    value: "mobileNumber",
  },
  {
    label: "Akun",
    value: "custName",
  },
];

const optionsFilterDate = [
  { value: "all", label: "Semua" },
  { value: "today", label: "Hari Ini" },
  { value: "yesterday", label: "Kemarin" },
  { value: "lastWeek", label: "Seminggu yang Lalu" },
  { value: "lastMonth", label: "Sebulan yang Lalu" },
  { value: "custom", label: "Custom" },
];

const optionsFilterStatus = [
  { value: "1", label: "Belum Dibayar" },
  { value: "2", label: "Belum Diproses" },
  { value: "3", label: "Berhasil" },
  { value: "4", label: "Gagal" },
  { value: "5", label: "Kadaluarsa" },
  { value: "6", label: "Sedang Diproses" },
];

const TableDeposit: React.FC<{
  data: IOrderWithAnalitycsPaginationWithDetail;
}> = ({ data }) => {
  const datePickerRef = useRef<DatePicker>(null);
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

  const [selectedOptionDate, setSelectedOptionDate] = useState<{
    label: string;
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

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<
    IOrderHistoryWithDetail | undefined
  >();
  const [showFilter, setShowFilter] = useState(false);

  const [newData, setNewData] = useRecoilState(orderHistoryState);

  const getNewData = async () => {
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
        "/v1/deposits?" +
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
        analytics: res.analytics,
      });
    }

    setLoading(false);
  };

  const handlePageClick = ({ selected }: { selected: any }) => {
    setQuery((prev) => ({
      ...prev,
      page: selected + 1,
    }));
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
    setSelectedOptionDate(null);
    setSelectedFilterLimit(null);
  };

  useEffect(() => {
    if (selectedOptionDate) {
      let date: { startDate: string; endDate: string } = {
        startDate: "",
        endDate: "",
      };
      if (selectedOptionDate.value === "today") {
        const today = dayjs();
        date.startDate = today.startOf("day").toISOString();
        date.endDate = today.endOf("day").toISOString();
      } else if (selectedOptionDate.value === "yesterday") {
        const yesterday = dayjs().subtract(1, "day");
        date.startDate = yesterday.startOf("day").toISOString();
        date.endDate = yesterday.endOf("day").toISOString();
      } else if (selectedOptionDate.value === "lastWeek") {
        const endDate = dayjs();
        const startDate = endDate.subtract(7, "day");
        date.startDate = startDate.startOf("day").toISOString();
        date.endDate = endDate.endOf("day").toISOString();
      } else if (selectedOptionDate.value === "lastMonth") {
        const endDate = dayjs();
        const startDate = endDate.subtract(1, "month");
        date.startDate = startDate.startOf("day").toISOString();
        date.endDate = endDate.endOf("day").toISOString();
      } else if (selectedOptionDate.value === "custom") {
        if (datePickerRef.current) {
          datePickerRef.current.setOpen(true);
        }
      }

      if (selectedOptionDate.value !== "custom") {
        setQuery((prev) => {
          const check = prev.search.findIndex((item) => item.key === "start");
          const check2 = prev.search.findIndex((item) => item.key === "end");

          if (check !== -1 && check2 !== -1) {
            prev.search[check].value = date.startDate;
            prev.search[check2].value = date.endDate;
          } else {
            prev.search.push({
              key: "start",
              value: date.startDate,
            });
            prev.search.push({
              key: "end",
              value: date.endDate,
            });
          }

          prev.page = 1;

          return { ...prev };
        });
      }
    }
  }, [selectedOptionDate?.label, selectedOptionDate?.value]);

  useEffect(() => {
    getNewData();
  }, [JSON.stringify(query), query.search.length]);

  useEffect(() => {
    setNewData({ ...newData, ...data });
  }, []);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (startDate && endDate) {
      setQuery((prev) => {
        const check = prev.search.findIndex((item) => item.key === "start");
        const check2 = prev.search.findIndex((item) => item.key === "end");

        if (check !== -1 && check2 !== -1) {
          prev.search[check].value = dayjs(startDate)
            .startOf("day")
            .toISOString();
          prev.search[check2].value = dayjs(endDate).endOf("day").toISOString();
        } else {
          prev.search.push({
            key: "start",
            value: dayjs(startDate).startOf("day").toISOString(),
          });
          prev.search.push({
            key: "end",
            value: dayjs(endDate).endOf("day").toISOString(),
          });
        }

        prev.page = 1;

        return { ...prev };
      });
    }
  }, [startDate, endDate]);

  const handleChangeDeposit = async (data: any, approve: boolean) => {
    const toastId = toast.loading("Sedang menyimpan data...");
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/approval-deposit",
      {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.id,
          status: approve,
        }),
      }
    );

    if (req.ok) {
      toast.update(toastId, {
        render: `Deposit Berhasil di ${approve ? "Approve" : "Reject"}`,
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render: res.message,
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    getNewData();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl overflow-y-hidden p-8">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800 mb-4">
            Riwayat Deposit
          </h1>

          <div className="flex gap-4 items-center justify-between flex-wrap">
            <div className="w-full lg:w-1/2 flex gap-4 lg:items-center flex-col md:flex-row">
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
              className={`${
                showFilter ? "flex flex-col md:flex-row" : "hidden md:flex"
              } gap-4 flex-wrap w-full md:w-max`}
            >
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
                className="px-2 py-2 text-primary-600 cursor-pointer hidden md:inline-block"
              >
                Clear Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="w-full inline-block align-middle">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="p-4 bg-slate-100">
                    <tr>
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
                      {/* <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Denom
                                                    </th> */}
                      <th
                        scope="col"
                        className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
                      >
                        Akun
                      </th>
                      <th
                        scope="col"
                        className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
                      >
                        No. Whatsapp
                      </th>
                      <th
                        scope="col"
                        className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase"
                      >
                        Kuantitas
                      </th>
                      {/* <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Total
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                    >
                                                        Status
                                                    </th> */}
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
                      <tr key={data.id} className={`bg-white`}>
                        <td className="px-4 py-4 font-medium text-gray-800 text-sm whitespace-nowrap">
                          {formatter(data.totalAmt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <StatusesOrder value={data.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.custName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.mobileNumber}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.quantity}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.status === "3" || data.status === "4" ? (
                            <div className="flex justify-start gap-2 w-full">
                              <div className="bg-gray-400 px-4 py-2 rounded-md text-white cursor-not-allowed">
                                Approve
                              </div>
                              <div className="bg-gray-400 px-4 py-2 rounded-md text-white cursor-not-allowed">
                                Reject
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-start gap-2 w-full">
                              <div
                                onClick={(e) => handleChangeDeposit(data, true)}
                                className="bg-emerald-600 px-4 py-2 rounded-md text-white cursor-pointer"
                              >
                                Approve
                              </div>
                              <div
                                onClick={(e) =>
                                  handleChangeDeposit(data, false)
                                }
                                className="bg-primary-900 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-600"
                              >
                                Reject
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default TableDeposit;
