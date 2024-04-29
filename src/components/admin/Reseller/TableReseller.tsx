"use client";

import { userAdmin } from "@/atom/userAdminState";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "../Pagination";
import Loading from "@/app/(admin)/admin/user/loading";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currencyConverter } from "@/lib/currencyConverter";

const TableUser: React.FC<{ user: IUserPaginationWithSearch }> = ({ user }) => {
  const [customer, setCustomer] = useRecoilState(userAdmin);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(customer.keySearch || "");
  const [order, setOrder] = useState<"DESC" | "ASC">(user.order);
  const [sort, setSort] = useState(user.sort);

  const getCustomers = async (pagination?: Partial<IPagination>) => {
    setLoading(true);
    const searchParams = new URLSearchParams();

    if (searchQuery) {
      searchParams.append("keyword", searchQuery);
    }

    if (pagination && pagination.page) {
      searchParams.append("page", pagination.page.toString());
    } else {
      searchParams.append("page", user.page.toString());
    }

    searchParams.append("limit", user.limit.toString());
    searchParams.append("order", order || user.order);
    searchParams.append("sort", sort || user.sort);
    searchParams.append("type", "reseller");

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/user?${searchParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const res = await req.json();

      if (req.ok) {
        setCustomer({ ...customer, ...res, keySearch: searchQuery });
      } else {
        console.error("Failed to fetch customers:", req.statusText);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    const page = selected + 1;
    setCustomer({ ...customer, page });
    getCustomers({ page });
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "ASC" || event.target.value === "DESC") {
      setOrder(event.target.value);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
  };

  // Initialize customer state
  useEffect(() => {
    setCustomer({ ...user, keySearch: "" });
  }, [user, setCustomer]);

  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, order, sort]);

  return (
    <div className="xl:p-10">
      <div className="w-full overflow-x-scroll md:overflow-x-auto overflow-y-hidden bg-white shadow rounded-2xl px-8 py-10">
        <div>
          <p className="text-2xl font-semibold text-neutral-800">Reseller</p>
          <div className="header p-1 flex justify-between gap-16 shrink-0 mb-4 mt-6 w-full overflow-x-auto">
            <div className="filter flex gap-3 w-max">
              <select
                name="sort"
                id="sort"
                onChange={handleSortChange}
                className="inline-flex shrink-0 items-center px-6 py-2 rounded-md gap-x-2 text-rose-500 bg-rose-100/60 border-0 "
              >
                <option value="createdAt">SORT BY</option>
                <option value="createdAt">BALANCE</option>
                <option value="name">NAME</option>
                <option value="email">EMAIL</option>
                <option value="mobileNumber">MOBILE NUMBER</option>
              </select>
              <select
                name="sort"
                id="order"
                onChange={handleOrderChange}
                className="inline-flex shrink-0 items-center px-6 py-2 rounded-md gap-x-2 text-rose-500 bg-rose-100/60 border-0 "
              >
                <option value="DESC">ORDER</option>
                <option value="DESC">DESCENDING</option>
                <option value="ASC" className="text-white">
                  ASCENDING
                </option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search people"
                onChange={handleSearchInputChange}
                className="inline-flex items-center px-6 py-2 rounded-md gap-x-2 bg-rose-100/60 text-primary-900 placeholder:text-primary-900 border-primary-900"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute top-1/2 right-6 -translate-y-1/2 text-primary-900 text-lg"
              />
            </div>
          </div>
        </div>
        {loading && <Loading />}
        {!loading && (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="w-max xl:w-full inline-block align-middle">
                <div className="overflow-hidden overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase "
                        ></th>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                        >
                          Nama
                        </th>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                        >
                          No Whatsapp
                        </th>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-center"
                        >
                          Balance
                        </th>
                        <th
                          scope="col"
                          className="px-6 lg:py-4 lg:py-5 text-xs font-bold text-right text-neutral-600 uppercase text-right"
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
                            <td className="py-4 pl-8">
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
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                              {data.email}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                              {data.mobileNumber}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                              {data.balance && currencyConverter(data.balance)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-right">
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
        {customer.data.length > 0 && (
          <Pagination
            onPageChange={handlePageClick}
            page={user.page}
            limit={user.limit}
            total={user.total}
            totalPage={user.totalPage}
          />
        )}
      </div>
    </div>
  );
};

export default TableUser;
