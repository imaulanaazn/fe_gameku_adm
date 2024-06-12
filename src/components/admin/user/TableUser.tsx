"use client";

import { userAdmin } from "@/atom/userAdminState";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "@/components/admin/Pagination";
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
    <div className="w-full overflow-x-scroll md:overflow-x-auto overflow-y-hidden bg-white rounded-2xl p-6 lg:p-8">
      <div>
        <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
          User
        </h1>
        {loading && <Loading />}
        {!loading && (
          <div className="flex flex-col mt-6">
            <div className="overflow-x-auto">
              <div className="w-max xl:w-full inline-block align-middle">
                <div className="overflow-hidden overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="px-4 py-4 bg-slate-100">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase "
                        ></th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                        >
                          Nama
                        </th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                        >
                          No Whatsapp
                        </th>
                        <th
                          scope="col"
                          className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                        >
                          Tanggal Pendaftaran
                        </th>
                      </tr>
                    </thead>
                    {customer.data.length > 0 && (
                      <tbody className="divide-y divide-gray-200">
                        {customer.data.map((data) => (
                          <tr
                            key={data.id}
                            className={`bg-white hover:bg-gray-100`}
                          >
                            <td className="py-4 pl-6 lg:pl-8">
                              <div className="w-10 h-10 object-cover">
                                <Image
                                  src={data.image || "/images/IconUser.png"}
                                  alt={`Logo User`}
                                  width="0"
                                  height="0"
                                  sizes="100vw"
                                  style={{ width: "100%", height: "100%" }}
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4 text-base text-gray-800  whitespace-nowrap text-left">
                              {data.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                              {data.email}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                              {data.mobileNumber}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                              {dayjs(data.createdAt).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                  {customer.data.length < 0 && (
                    <h1 className="text-center text-lg font-medium text-slate-600 mx-auto my-12">
                      No Data Found
                    </h1>
                  )}
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
    </div>
  );
};

export default TableUser;
