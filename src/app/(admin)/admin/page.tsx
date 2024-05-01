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
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Loading from "./loading";
import { io } from "socket.io-client";
import AdminNavbar from "@/components/admin/AdminNavbar/AdminNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Admin = () => {
  const [data, setData] = useState<IResponseApiAnalytics>();
  const [latestOrder, setLatestOrder] = useState<IOrderHistory[]>();
  const [todaysData, setTodaysData] = useState<IDataAnalythicsChartLine>();
  const [yesterdayData, setYesterdayData] =
    useState<IDataAnalythicsChartLine>();
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
    socket.on("order:success", (orderId: string) => {
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
    });

    socket.on("order:new", (data: IOrderHistory) => {
      setData((prev) => {
        if (prev) {
          prev.totalOrders30daysAgo++;
        }

        return prev;
      });
      getUpdateData("totalOrders", "orders");

      setLatestOrder((prev) => {
        if (prev) {
          const duplicateData = [...prev];
          duplicateData.pop();
          duplicateData.unshift(data);

          return duplicateData;
        }

        return prev;
      });

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
    });

    socket.on("count:register", () => {
      getUpdateData("totalCustomers", "registration");
    });

    getData("count", setData);
    getData("latestOrder", setLatestOrder);
    getData("popularGame", setPopularGame);

    return () => {
      socket.off("order:success");
      socket.off("order:new");
      socket.off("count:register");
    };
  }, []);

  useEffect(() => {
    const dateNow = dayjs().format("YYYY-MM-DD");
    const dateYesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const findDataNow = data?.data.find((data) => data.date === dateNow);
    const findDataYesterday = data?.data.find(
      (data) => data.date === dateYesterday
    );
    if (findDataNow) {
      setTodaysData(findDataNow);
    }

    if (findDataYesterday) {
      setYesterdayData(findDataYesterday);
    }
  }, [data]);

  return (
    <>
      <AdminNavbar />
      <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
        <h1 className="text-4xl font-semibold">Hello Admin</h1>
        <p className="text-lg mt-2">
          Selamat datang di dashboard, semoga bisnis anda berjalan lancar dan
          terus berkembang.
        </p>
      </div>
      {loading && <Loading />}
      {/* <Header title="Dashboard" /> */}
      {!loading && (
        <div className="stats-wrapper">
          <div className="w-11/12 mx-auto flex space-x-3 -translate-y-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={28}
              slidesPerView={1}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2.8,
                },
                1440: {
                  slidesPerView: 3.5,
                },
              }}
              freeMode={true}
              className="lg:max-w-screen-2xl flex items-center"
            >
              <SwiperSlide>
                <DisplayTotal
                  title="Pesanan"
                  value={todaysData?.totalOrders || 0}
                  valueBefore={yesterdayData?.totalOrders || 0}
                  icon={faShoppingCart}
                  colorIcon="blue-400"
                  countPercent={true}
                  classes={bgColors.orders}
                  day="HARI INI"
                />
              </SwiperSlide>
              <SwiperSlide>
                <DisplayTotal
                  title="Pesanan Berhasil"
                  value={todaysData?.paid || 0}
                  valueBefore={yesterdayData?.paid || 0}
                  icon={faCheck}
                  colorIcon="green-400"
                  countPercent={true}
                  classes={bgColors.ordersSuccess}
                  day="HARI INI"
                />
              </SwiperSlide>
              <SwiperSlide>
                <DisplayTotal
                  title="Pesanan Pending"
                  value={todaysData?.pending || 0}
                  valueBefore={yesterdayData?.pending || 0}
                  icon={faQuestion}
                  colorIcon="blue-400"
                  countPercent={true}
                  classes={bgColors.ordersFailed}
                  day="HARI INI"
                />
              </SwiperSlide>
              <SwiperSlide>
                <DisplayTotal
                  title="Pendaftaran"
                  value={todaysData?.totalCustomers || 0}
                  valueBefore={yesterdayData?.totalCustomers || 0}
                  icon={faUserPlus}
                  colorIcon="yellow-400"
                  countPercent={true}
                  classes={bgColors.registration}
                  day="HARI INI"
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="w-full flex space-x-3">
            {data?.data && (
              <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                <ChartOrderHistory data={data.data} />
              </div>
            )}
            <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
              {popularGame.length > 0 && (
                <ChartPopulargame data={popularGame} />
              )}
            </div>
          </div>
          {latestOrder && (
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
