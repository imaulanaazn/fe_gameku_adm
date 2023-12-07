"use client";

import StatusesOrder from "@/components/global/StatusesOrder";
import dayjs from "dayjs";
import Image from "next/image";

const TableRecentOrders: React.FC<{
    recentOrders: IOrderHistory[];
    classes: string;
    orderId?: string;
}> = ({ recentOrders, classes, orderId }) => {
    return (
        <div className="w-full bg-white rounded shadow overflow-x-scroll md:overflow-x-auto overflow-y-hidden mt-10">
            <div className="p-5 bg-white">
                <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">Pesanan Terkini</p>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                        >
                                            Denom
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                        >
                                            No. Whatsapp
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                        >
                                            Kuantitas
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                        >
                                            Tanggal Order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((data, index) => (
                                        <tr
                                            key={data.id}
                                            className={
                                                orderId
                                                    ? orderId === data.id
                                                        ? classes
                                                        : "bg-white"
                                                    : index === 0
                                                    ? classes
                                                    : "bg-white"
                                            }
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                <div className="flex gap-3 items-center">
                                                    <div className="h-10 aspect-square flex items-center">
                                                        <Image
                                                            src={data.logoUrl}
                                                            alt={`Logo Game`}
                                                            width="0"
                                                            height="0"
                                                            sizes="100vw"
                                                            style={{ width: "100%", height: "100%" }}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-base">{data.game}</p>
                                                        <p>{data.productName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{data.mobileNumber}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{data.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <StatusesOrder value={data.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableRecentOrders;
