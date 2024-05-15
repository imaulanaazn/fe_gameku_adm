"use client";

import ChartOrderHistory from "@/app/(admin)/admin/(dashboard)/components/ChartOrderHistory";
import ChartPopulargame from "@/app/(admin)/admin/(dashboard)/components/ChartPopulargame";
import DisplayTotal from "@/app/(admin)/admin/(dashboard)/components/DisplayTotal";
import TableRecentOrders from "@/app/(admin)/admin/(dashboard)/components/TableRecentOrders";
import Header from "@/components/admin/Header";
import {
  faArrowRotateRight,
  faCheck,
  faQuestion,
  faShoppingCart,
  faTimes,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import Loading from "./loading";
import { io } from "socket.io-client";
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import DatePicker from "react-datepicker";
import {
  carouselBreakpoints,
  initialStatusCounts,
  optionsStatsDate,
} from "./utils";
import Select from "react-select";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useDateRange, { useSocketEvents } from "./customHooks";
import { GestureSwipeHorizontal } from "mdi-material-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import AdminHeader from "@/components/admin/AdminHeader";

interface AnalyticsData {
  statusCount: StatusCounts;
  newBuyersCount: number;
  diagramData: DiagramData;
  popularGame: PopularGame[];
}

interface StatusCounts {
  pending: StatusDetail;
  success: StatusDetail;
  failed: StatusDetail;
  expired: StatusDetail;
}

interface StatusDetail {
  total: number;
  totalBefore: number;
  percentageChange: number;
}

interface DiagramData {
  startAt: string;
  endAt: string;
  data: DiagramDataEntry[];
}

interface DiagramDataEntry {
  date: string;
  totalOrders: number;
}

interface PopularGame {
  game: string;
  total: number;
}

interface IOptionStatsDate {
  label: string;
  value: string;
}

const Admin = () => {
  const [data, setData] = useState<IResponseApiAnalytics>();
  const [statusCounts, setStatusCounts] =
    useState<StatusCounts>(initialStatusCounts);
  const [totalOrders, setTotalOrders] = useState({
    total: 0,
    totalBefore: 0,
    percentageChange: 0,
  });
  const [newBuyers, setNewBuyers] = useState(0);
  const [diagramData, setDiagramData] = useState([]);
  const [selectedOptionStatsDate, setSelectedOptionStatsDate] =
    useState<IOptionStatsDate | null>(null);
  const [latestOrder, setLatestOrder] = useState<IOrderHistory[]>([]);
  const [popularGame, setPopularGame] = useState<
    { game: string; total: number }[]
  >([]);

  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [bgColors, setBgColors] = useState({
    orders: "bg-white",
    ordersFailed: "bg-white",
    ordersPending: "bg-white",
    ordersExpired: "bg-white",
    ordersSuccess: "bg-white",
    registration: "bg-white",
  });
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

  const handleOrderSuccess = useCallback((orderId: string) => {
    setLatestOrder((prev) => {
      return prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "success" };
        }
        return order;
      });
    });
  }, []);

  const handleOrderNew = useCallback((data: IOrderHistory) => {
    getUpdateData("totalOrders", "orders");

    setLatestOrder((prev) => [data, ...prev].slice(0, 10));

    setPopularGame((prev) => {
      if (prev) {
        const existingItem = prev.find((item) => item.game === data.game);

        if (existingItem) {
          existingItem.total++;
        } else {
          prev.push({
            game: data.game,
            total: 1,
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

  const getLatestOrder = async () => {
    setLoading(true);
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/latest-order`,
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
      setLatestOrder(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLatestOrder();
  }, []);

  useDateRange(
    selectedOptionStatsDate,
    refresh,
    async (dateRange: { startDate: string; endDate: string }) => {
      try {
        setStatsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/order-analytics?startAt=${dateRange.startDate}&endAt=${dateRange.endDate}`,
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

        const analytics = await response.json();

        setStatusCounts(analytics.data.statusCount);
        setTotalOrders(analytics.data.totalOrders);
        setNewBuyers(analytics.data.newBuyersCount);
        setPopularGame(analytics.data.popularGame);
        setDiagramData(analytics.data.diagramData.data);
        setStatsLoading(false);
      } catch (error) {
        setStatsLoading(false);
        console.error("Failed to get analytics", error);
      }
    }
  );

  return (
    <>
      <AdminNavbar />
      <AdminHeader>
        <div className="shrink-0 flex items-center gap-4">
          <Select
            id="selectStatsDate"
            value={selectedOptionStatsDate}
            isSearchable={false}
            onChange={(e: any) => {
              setSelectedOptionStatsDate(e);
            }}
            options={optionsStatsDate}
            placeholder="Rentang Statistik"
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 40 }),
              placeholder: (base) => ({
                ...base,
                color: "#b72025",
                fontWeight: 500,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#b72025",
                "&:hover": { color: "#b72025" },
              }),
              control: (provided, state) => ({
                ...provided,
                boxShadow: state.isFocused ? "0" : "0",
                paddingTop: "2px",
                paddingBottom: "2px",
                cursor: "pointer",
                color: "#b72025",
                borderColor: "#b72025",
                "&:hover": {
                  borderColor: "#b72025",
                  border: state.isFocused ? 0 : 0,
                },
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
                zIndex: 100,
                backgroundColor: state.isSelected ? "#b72025" : "white",
                color: state.isSelected ? "white" : "#333",
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "#f0f0f0",
                },
              }),
            }}
          />
          <div
            className={`hover:cursor-pointer ${statsLoading && "animate-spin"}`}
            onClick={() => {
              setRefresh((prev) => prev + 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateRight} className="text-xl" />
          </div>
        </div>
      </AdminHeader>

      {loading && <Loading />}
      {!loading && (
        <div className="stats-wrapper px-6 md:px-8 lg:-translate-y-10">
          <div className="w-full mx-auto flex space-x-3 mt-6 lg:mt-0">
            <Swiper
              spaceBetween={28}
              slidesPerView={1}
              breakpoints={carouselBreakpoints}
              freeMode={true}
              className="flex items-center"
            >
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan"
                  total={totalOrders.total}
                  percentageChange={totalOrders.percentageChange}
                  icon={faShoppingCart}
                  color={{
                    icon: "text-blue-500",
                    background: "bg-blue-100",
                    border: "border-blue-500",
                  }}
                  countPercent={true}
                  classes={bgColors.orders}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan Berhasil"
                  total={statusCounts.success.total}
                  percentageChange={statusCounts.success.percentageChange}
                  icon={faCheck}
                  color={{
                    icon: "text-emerald-500",
                    background: "bg-emerald-100",
                    border: "border-emerald-500",
                  }}
                  countPercent={true}
                  classes={bgColors.ordersSuccess}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan Pending"
                  total={statusCounts.pending.total}
                  percentageChange={statusCounts.pending.percentageChange}
                  icon={faQuestion}
                  color={{
                    icon: "text-yellow-500",
                    background: "bg-yellow-100",
                    border: "border-yellow-500",
                  }}
                  countPercent={true}
                  classes={bgColors.ordersPending}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pesanan Gagal"
                  total={statusCounts.failed.total}
                  percentageChange={statusCounts.failed.percentageChange}
                  icon={faXmark}
                  color={{
                    icon: "text-rose-500",
                    background: "bg-rose-100",
                    border: "border-rose-500",
                  }}
                  countPercent={true}
                  classes={bgColors.ordersFailed}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </SwiperSlide>
              <SwiperSlide className="pb-1">
                <DisplayTotal
                  title="Pembeli baru"
                  total={newBuyers}
                  percentageChange={0}
                  icon={faUserPlus}
                  color={{
                    icon: "text-orange-500",
                    background: "bg-orange-100",
                    border: "border-orange-500",
                  }}
                  countPercent={false}
                  classes={bgColors.registration}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 lg:mt-8">
            {diagramData.length > 0 && (
              <div className="w-full lg:w-1/2 p-5 bg-white rounded-xl shadow-sm">
                <ChartOrderHistory
                  data={diagramData}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              </div>
            )}
            <div className="w-full lg:w-1/2 p-5 bg-white rounded-xl">
              {popularGame.length > 0 && (
                <ChartPopulargame
                  data={popularGame}
                  day={
                    selectedOptionStatsDate
                      ? selectedOptionStatsDate.label
                      : "Sebulan Terakhir"
                  }
                />
              )}
            </div>
          </div>
          {latestOrder.length > 0 && (
            <TableRecentOrders
              recentOrders={latestOrder}
              classes={bgColorsLatestOrder}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Admin;
