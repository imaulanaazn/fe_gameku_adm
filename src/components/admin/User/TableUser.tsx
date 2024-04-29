"use client";

import { userAdmin } from "@/atom/userAdminState";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "../Pagination";
import Loading from "@/app/(admin)/admin/user/loading";

const TableUser: React.FC<{ user: IUserPagination }> = ({ user }) => {
  const [customer, setCustomer] = useRecoilState(userAdmin);
  const [loading, setLoading] = useState(false);

  const getCustomers = async (pagination?: Partial<IPagination>) => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    customer.keySearch && searchParams.append("name", customer.keySearch);
    if (pagination && pagination.page) {
      searchParams.append("page", pagination.page.toString());
    } else {
      searchParams.append("page", user.page.toString());
    }
    searchParams.append("limit", user.limit.toString());
    searchParams.append("order", user.order);
    searchParams.append("sort", user.sort);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/user?" + searchParams.toString(),
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
      setCustomer({ ...user, ...res });
    }

    setLoading(false);
  };

  const handlePageClick = ({ selected }: { selected: any }) => {
    const page = selected + 1;
    getCustomers({ page });
    setCustomer({
      ...customer,
      page,
    });
  };

  useEffect(() => {
    setCustomer({ ...customer, ...user });
  }, []);

  return (
    <div className="w-full bg-white rounded shadow overflow-x-scroll md:overflow-x-auto overflow-y-hidden">
      <div className={`p-5 bg-white`}>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">User</p>
        </div>
      </div>
      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="w-full inline-block align-middle">
              <div className="overflow-hidden overflow-x-auto px-5">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      ></th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Nama
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        No Whatsapp
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Tanggal Pendaftaran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customer.data.map((data) => (
                      <tr
                        key={data.id}
                        className={`bg-white hover:bg-gray-100`}
                      >
                        <td className="py-3 pl-4">
                          <div className="w-12 h-12 object-cover">
                            <Image
                              src="/images/IconUser.png"
                              alt={`Logo User`}
                              width="0"
                              height="0"
                              sizes="100vw"
                              style={{ width: "100%", height: "100%" }}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {data.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {data.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {data.mobileNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
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
      )}
      <Pagination
        onPageChange={handlePageClick}
        page={user.page}
        limit={user.limit}
        total={user.total}
        totalPage={user.totalPage}
      />
    </div>
  );
};

export default TableUser;
