"use client";

import { userAdmin } from "@/atom/userAdminState";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "@/components/admin/Pagination";
import Loading from "@/app/(admin)/admin/user/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormAddUser from "./FormAddUser";

const TableRole: React.FC<{ user: IUserPagination }> = ({ user }) => {
  const [customer, setCustomer] = useRecoilState(userAdmin);
  const [loading, setLoading] = useState(false);
  const [typeForm, setTypeForm] = useState<"edit" | "add">("add");
  const [showForm, setShowForm] = useState(false);

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
    <>
      {showForm && (
        <FormAddUser
          handleShowForm={() => {
            setShowForm(false);
          }}
          getUsers={() => {}}
        />
      )}
      <div className="w-full overflow-x-scroll md:overflow-x-auto overflow-y-hidden bg-white rounded-2xl p-6 lg:p-8">
        <div>
          <div className="flex gap-6 lg:gap-8 items-center justify-between">
            <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
              User Management
            </h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setTypeForm("add");
              }}
              className="shrink-0 flex justify-between py-2 px-3 md:py-3 md:px-4 gap-2 md:gap-4 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
            >
              <p>User Baru</p>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>
          </div>
          {loading && <Loading />}
          {!loading && (
            <div className="flex flex-col mt-6">
              <div className="overflow-x-auto">
                <div className="w-max sm:w-full inline-block align-middle">
                  <div className="overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="px-4 py-4 bg-slate-100">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 w-0"
                          ></th>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                          >
                            Nama
                          </th>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                          >
                            Super Admin
                          </th>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                          >
                            Admin
                          </th>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                          >
                            Writer
                          </th>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                          >
                            Aksi
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
                              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name=""
                                  id=""
                                  className="rounded text-primary-900 border-primary-900 focus:ring-primary-900"
                                />
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name=""
                                  id=""
                                  className="rounded text-primary-900 border-primary-900 focus:ring-primary-900"
                                />
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name=""
                                  id=""
                                  className="rounded text-primary-900 border-primary-900 focus:ring-primary-900 mx-auto"
                                />
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center flex gap-4 items-center justify-center">
                                <button
                                  className="text-lg text-primary-900"
                                  onClick={() => {
                                    setShowForm(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="text-lg text-primary-900">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
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

          {/* <Pagination
          onPageChange={handlePageClick}
          page={user.page}
          limit={user.limit}
          total={user.total}
          totalPage={user.totalPage}
        /> */}
        </div>
      </div>
    </>
  );
};

export default TableRole;
