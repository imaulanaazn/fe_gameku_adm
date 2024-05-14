"use client";

import { userAdmin } from "@/atom/userAdminState";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Pagination from "@/components/admin/Pagination";
import Loading from "@/app/(admin)/admin/user/loading";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currencyConverter } from "@/lib/currencyConverter";
import Select from "react-select";

const optionsSortBy: { label: string; value: string }[] = [
  {
    label: "Created At",
    value: "createdAt",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Mobile Number",
    value: "mobileNumber",
  },
];

const optionsOrder: { label: string; value: string }[] = [
  {
    label: "ASCENDING",
    value: "ASC",
  },
  {
    label: "DESCENDING",
    value: "DESC",
  },
];

const TableUser: React.FC<{ user: IUserPaginationWithSearch }> = ({ user }) => {
  const [customer, setCustomer] = useRecoilState(userAdmin);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(customer.keySearch || "");
  const [selectedOptionSortBy, setSelectedOptionSortBy] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedOptionOrder, setSelectedOptionOrder] = useState<{
    label: string;
    value: string;
  } | null>(null);

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
    searchParams.append("order", selectedOptionOrder?.value || user.order);
    searchParams.append("sort", selectedOptionSortBy?.value || user.sort);
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

  useEffect(() => {
    setCustomer({ ...user, keySearch: "" });
  }, [user, setCustomer]);

  useEffect(() => {
    getCustomers();
  }, [searchQuery, selectedOptionOrder?.value, selectedOptionSortBy?.value]);

  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8">
      <div>
        <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
          Reseller
        </h1>
        <div className="p-1 flex flex-col md:flex-row justify-between gap-4 shrink-0 mb-4 mt-6 w-full">
          <div className="relative w-full md:w-max">
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
          <div className="w-full filter flex gap-3 w-max flex-wrap">
            <Select
              id="sort_by"
              value={selectedOptionSortBy}
              onChange={(e: any) => {
                setSelectedOptionSortBy(e);
              }}
              options={optionsSortBy}
              isSearchable={false}
              placeholder="Urutkan Berdasarkan"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  color: "#b72025",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#b72025",
                  "&:hover": { color: "#b72025" },
                }),
                control: (provided, state) => ({
                  ...provided,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  cursor: "pointer",
                  color: "#b72025",
                  borderColor: "#b72025",
                  "&:hover": { borderColor: "#b72025" },
                  borderRadius: "0.4rem",
                  backgroundColor: "#fff3f3",
                }),
                singleValue: (provided, state) => ({
                  ...provided,
                  color: "#b72025",
                  cursor: "pointer",
                }),
                option: (provided, state) => ({
                  ...provided,
                  whiteSpace: "nowrap",
                  backgroundColor: state.isSelected ? "#b72025" : "white",
                  color: state.isSelected ? "white" : "#333",
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }),
              }}
            />
            <Select
              id="order"
              value={selectedOptionOrder}
              onChange={(e: any) => {
                setSelectedOptionOrder(e);
              }}
              options={optionsOrder}
              isSearchable={false}
              placeholder="Urutan"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  color: "#b72025",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#b72025",
                  "&:hover": { color: "#b72025" },
                }),
                control: (provided, state) => ({
                  ...provided,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  cursor: "pointer",
                  color: "#b72025",
                  borderColor: "#b72025",
                  "&:hover": { borderColor: "#b72025" },
                  borderRadius: "0.4rem",
                  backgroundColor: "#fff3f3",
                }),
                singleValue: (provided, state) => ({
                  ...provided,
                  color: "#b72025",
                  cursor: "pointer",
                }),
                option: (provided, state) => ({
                  ...provided,
                  whiteSpace: "nowrap",
                  backgroundColor: state.isSelected ? "#b72025" : "white",
                  color: state.isSelected ? "white" : "#333",
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }),
              }}
            />
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col">
          <div className="w-full overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="py-3 pl-4 bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  ></th>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  >
                    No Whatsapp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                  >
                    Tanggal Pendaftaran
                  </th>
                </tr>
              </thead>
              {customer.data.length > 0 && (
                <tbody className="divide-y divide-gray-200">
                  {customer.data.map((data) => (
                    <tr key={data.id} className={`bg-white hover:bg-gray-100`}>
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
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                        {data.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                        {data.mobileNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                        {data.balance && currencyConverter(data.balance)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                        {dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}
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
  );
};

export default TableUser;
