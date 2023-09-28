import ChartOrderHistory from "@/components/admin/Dashboard/ChartOrderHistory";
import ChartPopulargame from "@/components/admin/Dashboard/ChartPopulargame";
import DisplayTotal from "@/components/admin/Dashboard/DisplayTotal";
import TableRecentOrders from "@/components/admin/Dashboard/TableRecentOrders";
import Header from "@/components/admin/Header";
import { faCheck, faShoppingCart, faTimes, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const Admin = () => {
    return (
        <>
            <Header title="Dashboard" />
            <div className="w-full flex space-x-3">
                <DisplayTotal title="Pesanan" value="1000" icon={faShoppingCart} bgColorIcon="bg-blue-400" />
                <DisplayTotal title="Pesanan Berhasil" value="100000" icon={faCheck} bgColorIcon="bg-green-400" />
                <DisplayTotal title="Pesanan Gagal" value="123213" icon={faTimes} bgColorIcon="bg-red-400" />
                <DisplayTotal title="Pendaftaran" value="123213" icon={faUserPlus} bgColorIcon="bg-yellow-400" />
            </div>
            <div className="w-full flex space-x-3">
                <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                    <ChartOrderHistory />
                </div>
                <div className="w-1/2 mt-5 p-5 bg-white rounded-lg shadow-lg">
                    <ChartPopulargame />
                </div>
            </div>
            <div className="w-full mt-5 p-5 bg-white rounded-lg shadow-lg">
                <TableRecentOrders />
            </div>
        </>
    );
};

export default Admin;
