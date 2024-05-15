"use client";

import StatusesOrder from "@/components/global/StatusesOrder";
import dayjs from "dayjs";
import Image from "next/image";

const TableRecentOrders: React.FC<{
  recentOrders: any;
  classes: string;
  orderId?: string;
}> = ({ recentOrders, classes, orderId }) => {
  return (
    <div className="w-full overflow-x-scroll md:overflow-x-auto overflow-y-hidden bg-white rounded-2xl p-6 lg:p-8 mt-6 lg:mt-8 mb-6 lg:mb-8">
      <div>
        <div className="mb-8 bg-white">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
            Pesanan Terbaru
          </h1>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="w-max lg:w-full inline-block align-middle">
              <div className="overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="p-4 bg-slate-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-6 lg:py-4 lg:py-6 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                      >
                        Denom
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-6 lg:py-4 lg:py-6 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                      >
                        No. Whatsapp
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-6 lg:py-4 lg:py-6 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                      >
                        Kuantitas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-6 lg:py-4 lg:py-6 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-6 lg:py-4 lg:py-6 text-xs font-bold text-right text-neutral-600 uppercase text-right"
                      >
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((data: any, index: number) => (
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
                                src={data.gameLogo || data.logoUrl}
                                alt={`Logo Game`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-base text-gray-700 whitespace-nowrap text-left">
                                {data.game}
                              </p>
                              <p className="text-sm text-gray-500 whitespace-nowrap text-left">
                                {data.productName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          {data.mobileNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          {data.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          <StatusesOrder value={data.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap text-right">
                          {dayjs(data.createdAt).format("YYYY-MM-DD HH:MM:ss")}
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
    </div>
  );
};

export default TableRecentOrders;
