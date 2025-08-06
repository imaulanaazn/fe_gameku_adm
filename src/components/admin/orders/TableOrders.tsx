"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  faArrowDown,
  faArrowRotateRight,
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
import Pagination from "@/components/admin/Pagination";
import formatter from "@/lib/formatter";
import StatusesOrder from "@/components/global/StatusesOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormOrders from "./FormOrders";
import { RefreshCircle } from "mdi-material-ui";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
const column = [
  {
    id: "game",
    name: "Game",
  },
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

const optionsDownloadDate = [
  { value: "today", label: "Hari Ini" },
  { value: "yesterday", label: "Kemarin" },
  { value: "lastWeek", label: "Seminggu yang Lalu" },
  { value: "lastMonth", label: "Sebulan yang Lalu" },
  { value: "custom", label: "Custom" },
];

const optionsStatsDate = [
  { value: "all", label: "Semua" },
  { value: "today", label: "Hari Ini" },
  { value: "yesterday", label: "Kemarin" },
  { value: "thisWeek", label: "Minggu ini" },
  { value: "thisMonth", label: "Bulan ini" },
  { value: "lastMonth", label: "Sebulan yang lalu" },
];

const optionsFilterStatus = [
  { value: "1", label: "Belum Dibayar" },
  { value: "2", label: "Belum Diproses" },
  { value: "3", label: "Berhasil" },
  { value: "4", label: "Gagal" },
  { value: "5", label: "Kadaluarsa" },
  { value: "6", label: "Sedang Diproses" },
];

const TableOrders: React.FC<{
  data: IOrderWithAnalitycsPaginationWithDetail;
}> = ({ data }) => {
  const datePickerRef = useRef<DatePicker>(null);
  const downloadDatePickerRef = useRef<DatePicker>(null);
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

  const [selectedOptionDownloadDate, setSelectedOptionDownloadDate] = useState<{
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

  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<
    IOrderHistoryWithDetail | undefined
  >();

  const [newData, setNewData] = useRecoilState(orderHistoryState);
  console.log(newData);

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
        "/v1/orders?" +
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
    if (selectedOptionDownloadDate) {
      let date: { startDate: string; endDate: string } = {
        startDate: "",
        endDate: "",
      };
      if (selectedOptionDownloadDate.value === "today") {
        const today = dayjs();
        date.startDate = today.startOf("day").toISOString();
        date.endDate = today.endOf("day").toISOString();
      } else if (selectedOptionDownloadDate.value === "yesterday") {
        const yesterday = dayjs().subtract(1, "day");
        date.startDate = yesterday.startOf("day").toISOString();
        date.endDate = yesterday.endOf("day").toISOString();
      } else if (selectedOptionDownloadDate.value === "lastWeek") {
        const endDate = dayjs();
        const startDate = endDate.subtract(7, "day");
        date.startDate = startDate.startOf("day").toISOString();
        date.endDate = endDate.endOf("day").toISOString();
      } else if (selectedOptionDownloadDate.value === "lastMonth") {
        const endDate = dayjs();
        const startDate = endDate.subtract(1, "month");
        date.startDate = startDate.startOf("day").toISOString();
        date.endDate = endDate.endOf("day").toISOString();
      }
      if (date.startDate && date.endDate) {
        downloadFile(date);
      }
    }
  }, [
    selectedOptionDownloadDate,
    selectedOptionDownloadDate?.label,
    selectedOptionDownloadDate?.value,
  ]);

  useEffect(() => {
    getNewData();
  }, [JSON.stringify(query), query.search.length]);

  useEffect(() => {
    setNewData({ ...newData, ...data });
  }, []);

  const [downloadDate, setDownloadDate] = useState({
    start: new Date(),
    end: null,
  });

  const onDownloadDateChange = (dates: any) => {
    const [start, end] = dates;
    setDownloadDate({ start, end });
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  async function downloadFile({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/download-report-order?startAt=${startDate}&endAt=${endDate}`,
        {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan_riwayat_pesanan.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  }

  useEffect(() => {
    if (downloadDate.start && downloadDate.end) {
      downloadFile({
        startDate: dayjs(downloadDate.start).startOf("day").toISOString(),
        endDate: dayjs(downloadDate.end ? downloadDate.end : new Date())
          .endOf("day")
          .toISOString(),
      });
    }
  }, [downloadDate]);

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

  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        selectsRange
        dropdownMode="select"
        minDate={new Date(2000, 0, 1)}
        maxDate={new Date(2100, 11, 31)}
        withPortal
        customInput={<input type="hidden" />}
        ref={datePickerRef}
        className="fixed z-50 top-0 left-0 w-full"
      />
      <DatePicker
        selected={downloadDate.start}
        onChange={onDownloadDateChange}
        startDate={downloadDate.start}
        endDate={downloadDate.end}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        selectsRange
        dropdownMode="select"
        minDate={new Date(2000, 0, 1)}
        maxDate={new Date(2100, 11, 31)}
        withPortal
        customInput={<input type="hidden" />}
        ref={downloadDatePickerRef}
        className="fixed z-50 top-0 left-0 w-full"
      />

      {showForm && (
        <FormOrders
          handleShowForm={(value: boolean) => setShowForm(value)}
          getNewData={getNewData}
          data={detailData}
          type={typeForm}
        />
      )}
      <>
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full bg-white rounded-xl overflow-y-hidden p-8 mt-8">
            <div
              className={`bg-white flex justify-between items-center mb-4 flex-wrap gap-2`}
            >
              <div className="flex items-center gap-4">
                <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
                  Pesanan
                </h1>
                <div onClick={() => getNewData()} className="cursor-pointer">
                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    className="text-xl text-primary-900"
                  />
                </div>
              </div>
              <div className="shrink-0">
                <Select
                  id="selectDownloadDate"
                  value={selectedOptionDownloadDate?.value}
                  key={`my_unique_select_key__${selectedOptionDownloadDate}`}
                  isSearchable={false}
                  onChange={(e: any) => {
                    e.value === "custom"
                      ? downloadDatePickerRef?.current?.setOpen(true)
                      : setSelectedOptionDownloadDate(e);
                  }}
                  options={optionsDownloadDate}
                  placeholder="Download Laporan"
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

            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex gap-4 items-center justify-between flex-wrap w-full md:w-max">
                <div className="w-full flex gap-4 items-center flex-wrap">
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

                  <div className="w-full md:w-max">
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
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          whiteSpace: "nowrap",
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
                className={`${
                  showFilter ? "flex flex-col md:flex-row" : "hidden md:flex"
                } gap-4 flex-wrap w-full md:w-max`}
              >
                <Select
                  id="filterDate"
                  value={selectedOptionDate}
                  onChange={(e: any) => {
                    setSelectedOptionDate(e);
                  }}
                  options={optionsFilterDate}
                  placeholder="Filter Tanggal"
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
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          whiteSpace: "nowrap",
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
                <button
                  onClick={() => handleClickClearButton()}
                  className="px-2 py-2 text-primary-600 cursor-pointer hidden md:inline-block"
                >
                  Clear Filter
                </button>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-100">
                  <tr>
                    {column.map((item) => (
                      <th
                        key={item.id}
                        scope="col"
                        className="p-4 text-xs font-bold text-left text-neutral-600 uppercase whitespace-nowrap"
                      >
                        <div
                          className="flex gap-2 items-center cursor-pointer"
                          onClick={() =>
                            setQuery((prev) => ({
                              ...prev,
                              sort: item.id,
                              order:
                                query.sort === item.id && query.order === "ASC"
                                  ? "DESC"
                                  : "ASC",
                            }))
                          }
                        >
                          <p>{item.name}</p>
                          {query.sort === item.id && (
                            <FontAwesomeIcon
                              icon={
                                query.order === "ASC" ? faArrowUp : faArrowDown
                              }
                            />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="p-4 text-xs font-bold text-left text-neutral-600 uppercase whitespace-nowrap">
                      Akun
                    </th>
                    <th className="p-4 text-xs font-bold text-left text-neutral-600 uppercase whitespace-nowrap">
                      No. Whatsapp
                    </th>
                    <th className="p-4 text-xs font-bold text-left text-neutral-600 uppercase whitespace-nowrap">
                      Waktu
                    </th>
                    <th className="p-4 text-xs font-bold text-right text-neutral-600 uppercase whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {newData.data.map((data) => (
                    <tr key={data.id} className="bg-white">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-4 items-center">
                          <div className="h-10 aspect-square">
                            <Image
                              src={data.logoUrl}
                              alt="Logo Game"
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                              {data.game}
                            </p>
                            <p className="text-sm text-gray-500 whitespace-nowrap">
                              {data.productName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
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
                        {dayjs(data.createdAt).format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowForm(true);
                              setTypeForm("detail");
                              setDetailData(data);
                            }}
                            className="bg-primary-900 px-4 py-2 rounded-md text-white hover:bg-red-600"
                          >
                            Lihat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </>
  );
};

export default TableOrders;
