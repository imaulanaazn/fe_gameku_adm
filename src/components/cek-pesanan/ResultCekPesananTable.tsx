import Image from "next/image";
import React from "react";
import Statuses from "./Statuses";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ResultCekPesananTable({
  orderHistory,
}: {
  orderHistory: IOrderHistory[];
}) {
  return (
    <div className="w-full max-w-full mx-auto">
      <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border  bg-white">
        <div className="flex-auto block mt-16 mb-8 lg:mt-20">
          <div className="overflow-x-auto">
            <table className="w-full my-0 align-middle text-dark border-neutral-200">
              <thead className="align-bottom">
                <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                  <th className="pb-3 text-start min-w-[175px] text-sm lg:text-base text-neutral-700">
                    GAME
                  </th>
                  <th className="pb-3 px-3 text-center min-w-[100px] text-sm lg:text-base text-neutral-700">
                    INVOICE ID
                  </th>
                  <th className="pb-3 px-3 text-center min-w-[175px] text-sm lg:text-base text-neutral-700">
                    STATUS
                  </th>
                  <th className="hidden px-3 lg:block pb-3 text-center min-w-[100px] text-sm lg:text-base text-neutral-700">
                    TANGGAL
                  </th>
                  <th className="pb-3 text-end min-w-[50px] text-sm lg:text-base text-neutral-700">
                    DETAILS
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-dashed last:border-b-0"
                  >
                    <td className="p-3 pl-0">
                      <div className="flex items-center">
                        <div className="relative inline-block shrink-0 me-4">
                          <Image
                            src={order.logoUrl}
                            className="w-[50px] h-[50px] inline-block shrink-0 rounded-lg"
                            alt={order.game}
                            width={50}
                            height={50}
                            sizes={"50"}
                          />
                        </div>
                        <div className="flex flex-col justify-start">
                          <p className="mb-1 font-medium xl:font-semibold text-sm md:text-base text-gray-700 hover:text-primary">
                            {" "}
                            {order.productName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <p className="mb-1 text-sm md:text-base text-gray-600 hover:text-primary">
                        {order.invoiceId}
                      </p>
                    </td>
                    <td className="p-3 text-center">
                      <span className="align-baseline inline-flex px-4 py-3 mr-auto items-center font-medium text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">
                        {" "}
                        <Statuses status={order.status} />
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <p className="text-center mb-1 text-sm md:text-base text-gray-600 hover:text-primary">
                        {dayjs(order.createdAt).format("DD MMM YYYY")}
                      </p>
                    </td>
                    <td className="p-3 pr-0">
                      <Link href={`/payment/${order.invoiceId}`}>
                        <span className="flex items-center justify-center lg:justify-end shrink-0 mx-auto">
                          <FontAwesomeIcon
                            icon={faChevronCircleRight}
                            className="text-xl lg:text-2xl text-slate-300 hover:text-primary-900 transition-all"
                          />
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
