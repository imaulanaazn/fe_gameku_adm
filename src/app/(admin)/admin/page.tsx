"use client";

import ChartOrderHistory from "@/components/admin/Dashboard/ChartOrderHistory";
import ChartPopulargame from "@/components/admin/Dashboard/ChartPopulargame";
import DisplayTotal from "@/components/admin/Dashboard/DisplayTotal";
import TableRecentOrders from "@/components/admin/Dashboard/TableRecentOrders";
import Header from "@/components/admin/Header";
import { faCheck, faQuestion, faShoppingCart, faTimes, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Loading from "./loading";
import { io } from "socket.io-client";

const Admin = () => {
    const [data, setData] = useState<IResponseApiAnalytics>();
    const [latestOrder, setLatestOrder] = useState<IOrderHistory[]>();
    const [todaysData, setTodaysData] = useState<IDataAnalythicsChartLine>();
    const [yesterdayData, setYesterdayData] = useState<IDataAnalythicsChartLine>();
    const [popularGame, setPopularGame] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [bgColors, setBgColors] = useState({
        orders: "bg-white",
        ordersFailed: "bg-white",
        ordersSuccess: "bg-white",
        registration: "bg-white",
    });
    const [bgColorsLatestOrder, setBgColorsLatestOrders] = useState("bg-white");
    const [updateOrderId, setUpdateOrderId] = useState("");
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL || "http://localhost:3001", {
        extraHeaders: {
            "ngrok-skip-browser-warning": "true",
        },
    });

    const getData = async (type: string, funcSetData: (data: any) => void) => {
        setLoading(true);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-analytics?type=" + type, {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

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
        const findDataYesterday = data?.data.find((data) => data.date === dateYesterday);
        if (findDataNow) {
            setTodaysData(findDataNow);
        }

        if (findDataYesterday) {
            setYesterdayData(findDataYesterday);
        }
    }, [data]);

    return (
        <>
            {loading && <Loading />}
            {!loading && (
                <>
                    <Header title="Dashboard" />
                    <div className="w-full flex space-x-3">
                        <DisplayTotal
                            title="Pesanan"
                            value={todaysData?.totalOrders || 0}
                            valueBefore={yesterdayData?.totalOrders || 0}
                            icon={faShoppingCart}
                            bgColorIcon="bg-blue-400"
                            countPercent={true}
                            classes={bgColors.orders}
                            day="HARI INI"
                        />
                        <DisplayTotal
                            title="Pesanan Berhasil"
                            value={todaysData?.paid || 0}
                            valueBefore={yesterdayData?.paid || 0}
                            icon={faCheck}
                            bgColorIcon="bg-green-400"
                            countPercent={true}
                            classes={bgColors.ordersSuccess}
                            day="HARI INI"
                        />
                        <DisplayTotal
                            title="Pesanan Pending"
                            value={todaysData?.pending || 0}
                            valueBefore={yesterdayData?.pending || 0}
                            icon={faQuestion}
                            bgColorIcon="bg-blue-400"
                            countPercent={true}
                            classes={bgColors.ordersFailed}
                            day="HARI INI"
                        />
                        <DisplayTotal
                            title="Pendaftaran"
                            value={todaysData?.totalCustomers || 0}
                            valueBefore={yesterdayData?.totalCustomers || 0}
                            icon={faUserPlus}
                            bgColorIcon="bg-yellow-400"
                            countPercent={true}
                            classes={bgColors.registration}
                            day="HARI INI"
                        />
                    </div>
                    <div className="w-full flex space-x-3">
                        {data?.data && (
                            <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                                <ChartOrderHistory data={data.data} />
                            </div>
                        )}
                        <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                            {popularGame.length > 0 && <ChartPopulargame data={popularGame} />}
                        </div>
                    </div>
                    {latestOrder && (
                        <TableRecentOrders
                            recentOrders={latestOrder}
                            classes={bgColorsLatestOrder}
                            orderId={updateOrderId}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default Admin;
