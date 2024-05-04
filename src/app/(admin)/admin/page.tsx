"use client";

import ChartOrderHistory from "@/components/admin/Dashboard/ChartOrderHistory";
import ChartPopulargame from "@/components/admin/Dashboard/ChartPopulargame";
import DisplayTotal from "@/components/admin/Dashboard/DisplayTotal";
import TableRecentOrders from "@/components/admin/Dashboard/TableRecentOrders";
import Header from "@/components/admin/Header";
import {
  faCheck,
  faQuestion,
  faShoppingCart,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import Loading from "./loading";
import { io } from "socket.io-client";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import DatePicker from "react-datepicker";
import { carouselBreakpoints, optionsStatsDate } from "./utils";
import Select from "react-select";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useDateRange, { useSocketEvents } from "./customHooks";

const Admin = () => {
  const [data, setData] = useState<IResponseApiAnalytics>();
  const [selectedOptionStatsDate, setSelectedOptionStatsDate] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [latestOrder, setLatestOrder] = useState<IOrderHistory[]>([]);
  const [popularGame, setPopularGame] = useState<
    { name: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [bgColors, setBgColors] = useState({
    orders: "bg-white",
    ordersFailed: "bg-white",
    ordersSuccess: "bg-white",
    registration: "bg-white",
  });
  const statsDatePickerRef = useRef<DatePicker>(null);
  const [bgColorsLatestOrder, setBgColorsLatestOrders] = useState("bg-white");
  const [updateOrderId, setUpdateOrderId] = useState("");

  const socket = io(
    process.env.NEXT_PUBLIC_SOCKET_BASE_URL || "http://localhost:3001",
    {
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  // Callback functions
  const handleOrderSuccess = useCallback((orderId: string) => {
    getUpdateData("paid", "ordersSuccess");
    setLatestOrder((prev) => {
      if (prev) {
        const check = prev.find((item) => item.id === orderId);
        if (check) {
          check.status = "3";
        }
      }

      return prev;
    });

    setUpdateOrderId(orderId);
    setBgColorsLatestOrders("bg-green-200 bg-opacity-30");

    setTimeout(() => {
      setUpdateOrderId("");
      setBgColorsLatestOrders("bg-white");
    }, 500);
  }, []);

  const handleOrderNew = useCallback((data: IOrderHistory) => {
    setData((prev) => {
      if (prev) {
        prev.totalOrders30daysAgo++;
      }

      return prev;
    });
    getUpdateData("totalOrders", "orders");

    setLatestOrder((prev) => [data, ...prev].slice(0, 5));

    setPopularGame((prev) => {
      if (prev) {
        const existingItem = prev.find((item) => item.name === data.game);

        if (existingItem) {
          existingItem.value++;
        } else {
          prev.push({
            name: data.game,
            value: 1,
          });
        }
      }
      return prev;
    });

    setBgColorsLatestOrders("bg-green-200 bg-opacity-30");
    setTimeout(() => {
      setBgColorsLatestOrders("bg-white");
    }, 500);
  }, []);

  const handleCountRegister = useCallback(() => {
    getUpdateData("totalCustomers", "registration");
  }, []);

  // Use custom hooks
  useSocketEvents(
    socket,
    handleOrderSuccess,
    handleOrderNew,
    handleCountRegister
  );

  const getUpdateData = (fieldUpdateData: string, fieldUpdateColor: string) => {
    setData((prev) => {
      if (prev && prev.data) {
        const newData: IResponseApiAnalytics = { ...prev };
        const dateNow = dayjs().format("YYYY-MM-DD");

        const checkData = newData.data.find((item) => item.date === dateNow);
        if (checkData) {
          checkData[fieldUpdateData]++;
        }

        setBgColors((prev) => {
          return {
            ...prev,
            [fieldUpdateColor]: "bg-green-200 bg-opacity-30",
          };
        });

        setTimeout(() => {
          setBgColors((prev) => {
            return {
              ...prev,
              [fieldUpdateColor]: "bg-white",
            };
          });
        }, 500);

        return newData;
      }

      return prev;
    });
  };

  useEffect(() => {
    const getData = async (type: string, funcSetData: (data: any) => void) => {
      setLoading(true);
      const req = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-analytics?type=" + type,
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
        funcSetData(res);
      }
      setLoading(false);
    };
    getData("count", setData);
    getData("latestOrder", setLatestOrder);
    getData("popularGame", setPopularGame);
  }, []);

  useDateRange(
    selectedOptionStatsDate,
    (dateRange: { startDate: string; endDate: string }) => {}
  );

  const todaysData = useMemo(() => {
    const dateNow = dayjs().format("YYYY-MM-DD");
    return data?.data.find((dataItem) => dataItem.date === dateNow);
  }, [data]);

  const yesterdayData = useMemo(() => {
    const dateYesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    return data?.data.find((dataItem) => dataItem.date === dateYesterday);
  }, [data]);

  return (
    <>
      <AdminNavbar />
      <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10 flex justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Hello Admin</h1>
          <p className="text-base mt-2">
            Selamat datang di dashboard, semoga bisnis anda berjalan lancar dan
            terus berkembang.
          </p>
        </div>
        <div className="shrink-0">
          <Select
            id="selectStatsDate"
            value={selectedOptionStatsDate?.value}
            isSearchable={false}
            onChange={(e: any) => {
              e.value === "custom"
                ? statsDatePickerRef?.current?.setOpen(true)
                : setSelectedOptionStatsDate(e);
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
        </div>
      </div>
      {loading && <Loading />}
      {!loading && (
        <div className="stats-wrapper px-8">
          <div className="w-full mx-auto flex space-x-3 -translate-y-8">
            <Swiper
              modules={[]}
              spaceBetween={28}
              slidesPerView={1}
              breakpoints={carouselBreakpoints}
              freeMode={true}
              className="lg:max-w-screen-2xl flex items-center"
            >
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan"
                  value={todaysData?.totalOrders || 0}
                  valueBefore={yesterdayData?.totalOrders || 0}
                  icon={faShoppingCart}
                  color={{
                    icon: "text-blue-500",
                    background: "bg-blue-100",
                    border: "border-blue-500",
                  }}
                  countPercent={true}
                  classes={bgColors.orders}
                  day="Hari Ini"
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan Berhasil"
                  value={todaysData?.paid || 0}
                  valueBefore={yesterdayData?.paid || 0}
                  icon={faCheck}
                  color={{
                    icon: "text-emerald-500",
                    background: "bg-emerald-100",
                    border: "border-emerald-500",
                  }}
                  countPercent={true}
                  classes={bgColors.ordersSuccess}
                  day="Hari Ini"
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan Pending"
                  value={todaysData?.pending || 0}
                  valueBefore={yesterdayData?.pending || 0}
                  icon={faQuestion}
                  color={{
                    icon: "text-yellow-500",
                    background: "bg-yellow-100",
                    border: "border-yellow-500",
                  }}
                  countPercent={true}
                  classes={bgColors.ordersFailed}
                  day="Hari Ini"
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pembeli baru"
                  value={todaysData?.totalCustomers || 0}
                  valueBefore={yesterdayData?.totalCustomers || 0}
                  icon={faUserPlus}
                  color={{
                    icon: "text-orange-500",
                    background: "bg-orange-100",
                    border: "border-orange-500",
                  }}
                  countPercent={true}
                  classes={bgColors.registration}
                  day="Hari Ini"
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="w-full flex space-x-8">
            {data?.data && (
              <div className="w-1/2 p-5 bg-white rounded-xl shadow-sm">
                <ChartOrderHistory data={data.data} />
              </div>
            )}
            <div className="w-1/2 p-5 bg-white rounded-xl shadow-sm">
              {popularGame.length > 0 && (
                <ChartPopulargame data={popularGame} />
              )}
            </div>
          </div>
          {latestOrder.length > 0 && (
            <TableRecentOrders
              recentOrders={latestOrder}
              classes={bgColorsLatestOrder}
              orderId={updateOrderId}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Admin;
