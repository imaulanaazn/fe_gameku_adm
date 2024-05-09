"use client";

import TableOrders from "@/components/admin/Orders/TableOrders";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "./loading";
import { useEffect, useRef, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";
import Select from "react-select";
import { initialRevenue, optionsStatsDate } from "./utils";
import DisplayTotal from "@/components/admin/Dashboard/DisplayTotal";
import {
  faArrowRotateRight,
  faCheckCircle,
  faMoneyBill,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useDateRange } from "./customHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

const Orders = () => {
  const [data, setData] =
    useState<IOrderWithAnalitycsPaginationWithDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenue, setRevenue] = useState(initialRevenue);
  const [refresh, setRefresh] = useState(0);
  const [statsDate, setStatsDate] = useState({
    start: new Date(),
    end: null,
  });

  const onStatsDateChange = (dates: any) => {
    const [start, end] = dates;
    setStatsDate({ start, end });
  };
  const [selectedOptionStatsDate, setSelectedOptionStatsDate] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const statsDatePickerRef = useRef<DatePicker>(null);

  useDateRange(
    selectedOptionStatsDate,
    statsDate,
    refresh,
    async (dateRange: { startDate: string; endDate: string }) => {
      try {
        setRevenueLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/order-revenue?startAt=${dateRange.startDate}&endAt=${dateRange.endDate}`,
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

        const revenue = await response.json();
        setRevenue(revenue.data);
        setRevenueLoading(false);
      } catch (error) {
        console.error("Failed to get revenue", error);
        setRevenueLoading(false);
      }
    }
  );

  const getData = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/orders", {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (req.ok) {
      setData({ ...data, ...res });
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AdminNavbar />
          <div className="fixed top-0 left-0 z-50">
            <DatePicker
              selected={statsDate.start}
              onChange={onStatsDateChange}
              startDate={statsDate.start}
              endDate={statsDate.end}
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              selectsRange
              dropdownMode="select"
              minDate={new Date(2000, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              withPortal
              customInput={<input type="hidden" />}
              ref={statsDatePickerRef}
            />
          </div>
          <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-semibold">Hello Admin</h1>
                <p className="text-base mt-2">
                  Selamat datang di dashboard, semoga bisnis anda berjalan
                  lancar dan terus berkembang.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-6">
                <Select
                  id="selectStatsDate"
                  value={selectedOptionStatsDate}
                  isSearchable={false}
                  onChange={(e: any) => {
                    if (e.value === "custom") {
                      statsDatePickerRef?.current?.setOpen(true);
                      setSelectedOptionStatsDate(e);
                    } else {
                      setSelectedOptionStatsDate(e);
                    }
                  }}
                  options={optionsStatsDate}
                  placeholder="Rentang Statistik"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      paddingTop: "6px",
                      paddingBottom: "6px",
                      cursor: "pointer",
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: "#333",
                      cursor: "pointer",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#007BFF" : "white",
                      color: state.isSelected ? "white" : "#333",
                      cursor: "pointer",
                      ":hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }),
                  }}
                />
                <div
                  className={`hover:cursor-pointer ${
                    revenueLoading && "animate-spin"
                  }`}
                  onClick={() => {
                    setRefresh((prev) => prev + 1);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    className="text-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="wrapper px-8 -mt-10">
            <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
              <DisplayTotal
                title="Pendapatan"
                total={revenue.revenue}
                percentageChange={0}
                icon={faMoneyBill}
                countPercent={false}
                color={{
                  icon: "text-yellow-400",
                  background: "bg-yellow-100",
                  border: "border-yellow-400",
                }}
                isCurrency={true}
                day={
                  selectedOptionStatsDate
                    ? selectedOptionStatsDate.value === "custom"
                      ? dayjs(statsDate.start).format("YY/MM/DD") +
                        " - " +
                        dayjs(statsDate.end || statsDate.start).format(
                          "YY/MM/DD"
                        )
                      : selectedOptionStatsDate.label
                    : "Setahun Terakhir"
                }
              />
              <DisplayTotal
                title="Pesanan Berhasil"
                total={revenue.totalTrxSuccess}
                countPercent={false}
                percentageChange={0}
                icon={faCheckCircle}
                color={{
                  icon: "text-emerald-400",
                  background: "bg-emerald-100",
                  border: "border-emerald-400",
                }}
                day={
                  selectedOptionStatsDate
                    ? selectedOptionStatsDate.value === "custom"
                      ? dayjs(statsDate.start).format("YY/MM/DD") +
                        " - " +
                        dayjs(statsDate.end || statsDate.start).format(
                          "YY/MM/DD"
                        )
                      : selectedOptionStatsDate.label
                    : "Setahun Terakhir"
                }
              />
            </div>
            {data && <TableOrders data={data} />}
          </div>
        </>
      )}
    </>
  );
};

export default Orders;
