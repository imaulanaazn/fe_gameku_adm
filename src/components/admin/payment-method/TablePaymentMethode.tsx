"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faCheckCircle,
  faCircleXmark,
  faFilter,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/global/loading/CompLoading";
import { paymentMethodAdminState } from "@/atom/paymentMethodAdminState";
import { FeeType } from "@/enum";
import Pagination from "@/components/admin/Pagination";
import { IActionBulk } from "@/interfaces/actionBulk";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import formatter from "@/lib/formatter";
import { showDeleteState } from "@/atom/showDeleteState";
import FormPaymentMethod from "./FormPaymentMethod";
import Select from "react-select";
const column = [
  {
    id: "name",
    name: "Nama",
  },
  {
    id: "isActive",
    name: "Status",
  },
  {
    id: "fee",
    name: "Fee",
  },
  {
    id: "minAmount",
    name: "Min Pembelian",
  },
  {
    id: "maxAmount",
    name: "Max Pembelian",
  },
];
const optionLimit = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "30",
    value: 30,
  },
  {
    label: "40",
    value: 40,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "100",
    value: 100,
  },
];
const optionStatus = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Tidak Aktif",
    value: false,
  },
];
const optionPaymentCategory = [
  {
    label: "E Wallet",
    value: "1",
  },
  {
    label: "QRIS",
    value: "2",
  },
  {
    label: "Virtual Account",
    value: "3",
  },
  {
    label: "Retail",
    value: "4",
  },
  {
    label: "Internal",
    value: "5",
  },
  {
    label: "Pulsa",
    value: "6",
  },
];

const TablePaymentMethod: React.FC<{ data: IPaymentMethodPagination }> = ({
  data,
}) => {
  const [inputSearch, setInputSearch] = useState("");
  const [query, setQuery] = useState<{
    search: {
      key: string;
      value: string;
    }[];
    order: string;
    limit: number;
    page: number;
    sort: string;
  }>({
    search: [],
    order: data.order,
    limit: data.limit,
    page: data.page,
    sort: data.sort,
  });

  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [paymentDetail, setPaymentDetail] = useState<
    IPaymentMethod | undefined
  >();

  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [dataActionBulk, setDataActionBulk] = useState<IActionBulk[]>([]);

  const [selected, setSelected] = useRecoilState(selectedAdminState);
  const [paymentsMethod, setPaymentsMethod] = useRecoilState(
    paymentMethodAdminState
  );
  const [showDelete, setShowDelete] = useRecoilState(showDeleteState);
  const [showFilter, setShowFilter] = useState(false);

  const getPaymentsMethod = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    if (query.search.length > 0) {
      for (const item of query.search) {
        searchParams.append(item.key, item.value);
      }
    }

    searchParams.append("page", query.page.toString());
    searchParams.append("limit", query.limit.toString());
    searchParams.append("order", query.order);
    searchParams.append("sort", query.sort);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/payment-method?" +
        searchParams.toString(),
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
      setPaymentsMethod({ ...paymentsMethod, ...res });
    }

    setLoading(false);
  };

  const activationBulk = async (activation: boolean) => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/payment-method/activation",
      {
        cache: "no-cache",
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          id: selected,
          isActive: activation,
        }),
      }
    );

    if (req.ok) {
      await getPaymentsMethod();
      setSelected([]);
      toast.success(
        activation
          ? "Berhasil Mengaktifkan Pembayaran"
          : "Berhasil Menonaktifkan Pembayaran",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } else {
      const res = await req.json();
      toast.error(`[${res.errorCode}] ${res.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handlePageClick = ({ selected }: { selected: any }) => {
    setQuery((prev) => ({
      ...prev,
      page: selected + 1,
    }));
    setSelectAll(false);
    setSelected([]);
  };

  const handleClickSearch = () => {
    setQuery((prev) => {
      const check = prev.search.findIndex((item) => item.key === "name");
      if (check !== -1) {
        prev.search[check].value = inputSearch;
      } else {
        prev.search.push({
          key: "name",
          value: inputSearch,
        });
      }

      prev.page = 1;

      return { ...prev };
    });
  };

  const handleClickClearButton = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: [],
    }));

    setSelectedPaymentCategory(null);
    setSelectedFilterStatus(null);
    setSelectedFilterLimit(null);
  };

  useEffect(() => {
    getPaymentsMethod();
  }, [JSON.stringify(query), query.search.length]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelected(paymentsMethod.data.map((game) => game.id));
    } else {
      setSelected([]);
    }
  };

  const handleRowSelect = (gameId: string) => {
    if (selected.includes(gameId)) {
      setSelected(selected.filter((id) => id !== gameId));
    } else {
      setSelected([...selected, gameId]);
    }
  };

  const handleSetActivation = (activation: boolean) => {
    activationBulk(activation);
  };

  useEffect(() => {
    setPaymentsMethod({ ...paymentsMethod, ...data });
  }, []);

  useEffect(() => {
    if (paymentsMethod.data.length !== selected.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  }, [paymentsMethod.data.length, selected.length, selectAll]);

  return (
    <>
      {showForm && paymentDetail?.id && (
        <FormPaymentMethod
          handleShowForm={(value: boolean) => setShowForm(value)}
          paymentMethodData={paymentDetail}
          setPaymentMethodData={(paymentMethodData: IPaymentMethod) => {
            const paymentMethodDataPosition = paymentsMethod.data.findIndex(
              (data) => data.id === paymentMethodData.id
            );
            const newPaymentMethodData = [...paymentsMethod.data];
            paymentMethodDataPosition >= 0 &&
              (newPaymentMethodData[paymentMethodDataPosition] =
                paymentMethodData);
            paymentMethodDataPosition >= 0 &&
              setPaymentsMethod((prev) => ({
                ...prev,
                data: newPaymentMethodData,
              }));
          }}
          type={typeForm}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl p-6 lg:p-8">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800 mb-4">
            Metode Pembayaran
          </h1>

          <div className="flex gap-4 items-center justify-between items-center flex-wrap">
            <div className="relative md:w-max w-full">
              <input
                type="text"
                placeholder={`Cari Pembayaran`}
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                className="peer inline-flex items-center w-full md:w-auto px-6 py-2 rounded-md gap-x-2 focus:bg-primary-50 text-primary-900 placeholder:text-primary-900 border-primary-900 focus:border-primary-900"
              />
              <button
                type="button"
                disabled={!inputSearch}
                onClick={(e) => handleClickSearch()}
                className="absolute top-1/2 right-3 -translate-y-1/2 peer-focus:bg-primary-50 h-[90%] w-auto aspect-square rounded-r-md"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-primary-900 text-lg"
                />
              </button>
            </div>

            <div className="flex justify-between md:hidden md:hidden w-full">
              <button
                className="flex-1 flex justify-start items-center gap-2 text-primary-900 "
                onClick={() => {
                  setShowFilter((prev) => !prev);
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                {showFilter ? "Close" : "Filter"}
              </button>
              {showFilter && (
                <button
                  onClick={() => handleClickClearButton()}
                  className="flex-1 py-2 rounded-md text-primary-900 cursor-pointer text-right"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div
              className={`${
                showFilter ? "flex flex-col md:flex-row" : "hidden md:flex"
              } justify-between items-center w-full md:w-max`}
            >
              <div className="flex gap-4 items-center flex-wrap w-full md:w-max">
                {optionStatus && (
                  <div className="w-full md:w-max">
                    <Select
                      id="filterStatus"
                      value={selectedFilterStatus}
                      onChange={(e: any) => {
                        const data = {
                          key: "is_active",
                          value: e.value,
                        };
                        setQuery((prev) => {
                          const check = prev.search.find(
                            (item) => item.key === "is_active"
                          );
                          if (check) {
                            check.value = e.value;
                          } else {
                            prev.search.push(data);
                          }

                          prev.page = 1;

                          return prev;
                        });
                        setSelectedFilterStatus(e);
                      }}
                      options={optionStatus}
                      placeholder="Filter Status"
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
                          boxShadow: "none",
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          whiteSpace: "nowrap",
                          backgroundColor: state.isSelected
                            ? "#b72025"
                            : "white",
                          color: state.isSelected ? "white" : "#333",
                          cursor: "pointer",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }),
                      }}
                    />
                  </div>
                )}
                {optionPaymentCategory && (
                  <div className="w-full md:w-max">
                    <Select
                      id="filterPaymentCategory"
                      value={selectedPaymentCategory}
                      onChange={(e: any) => {
                        const data = {
                          key: "category",
                          value: e.value,
                        };
                        setQuery((prev) => {
                          const check = prev.search.find(
                            (item) => item.key === "category"
                          );
                          if (check) {
                            check.value = e.value;
                          } else {
                            prev.search.push(data);
                          }
                          prev.page = 1;
                          return prev;
                        });
                        setSelectedPaymentCategory(e);
                      }}
                      options={optionPaymentCategory}
                      placeholder="Filter Kategori"
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
                          boxShadow: "none",
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          whiteSpace: "nowrap",
                          backgroundColor: state.isSelected
                            ? "#b72025"
                            : "white",
                          color: state.isSelected ? "white" : "#333",
                          cursor: "pointer",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }),
                      }}
                    />
                  </div>
                )}
                {optionLimit && (
                  <div className="w-full md:w-max">
                    <Select
                      id="filterLimit"
                      value={selectedFilterLimit}
                      onChange={(e: any) => {
                        setSelectedFilterLimit(e);
                        setQuery((prev) => {
                          return { ...prev, limit: e.value };
                        });
                      }}
                      options={optionLimit}
                      placeholder="Limit PerPage"
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
                          boxShadow: "none",
                          backgroundColor: state.isFocused
                            ? "#fff3f3"
                            : "white",
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: "#b72025",
                          cursor: "pointer",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          whiteSpace: "nowrap",
                          backgroundColor: state.isSelected
                            ? "#b72025"
                            : "white",
                          color: state.isSelected ? "white" : "#333",
                          cursor: "pointer",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }),
                      }}
                    />
                  </div>
                )}
                <button
                  onClick={() => handleClickClearButton()}
                  className="px-2 py-2 text-primary-900 cursor-pointer hidden md:inline-block"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 flex justify-between items-center bg-primary-50 py-4 px-4 rounded-md">
              <h1 className="font-medium text-primary-900">
                {selected.length} items selected
              </h1>

              <div className="flex gap-4">
                <div className="relative">
                  <div
                    onClick={() => handleSetActivation(true)}
                    className="cursor-pointer"
                    data-tooltip-id="tooltip-activated"
                    data-tooltip-content="Aktifkan"
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      size="xl"
                      className="text-primary-900"
                    />
                  </div>
                  <ReactTooltip
                    id="tooltip-activated"
                    style={{
                      fontSize: "12px",
                      padding: "10px",
                    }}
                  />
                </div>
                <div className="relative">
                  <div
                    onClick={() => handleSetActivation(false)}
                    className="cursor-pointer"
                    data-tooltip-id="tooltip-diactivated"
                    data-tooltip-content="Nonaktifkan"
                  >
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      size="xl"
                      className="text-primary-900"
                    />
                  </div>
                  <ReactTooltip
                    id="tooltip-diactivated"
                    style={{
                      fontSize: "12px",
                      padding: "10px",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto">
              <div className="w-full inline-block align-middle">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="p-4 bg-slate-100">
                      <tr>
                        <th scope="col" className="py-3 pl-4">
                          <div className="flex items-center h-5 relative">
                            <input
                              type="checkbox"
                              name="selectAll"
                              id="selectAll"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className={`h-4 w-4 absolute cursor-pointer ${
                                !selectAll &&
                                selected.length > 0 &&
                                "appearance-none"
                              }`}
                            />
                            {!selectAll && selected.length > 0 && (
                              <div className="h-4 w-4 bg-gray-400 flex items-center justify-center">
                                <div className="w-2 h-1 bg-gray-200"></div>
                              </div>
                            )}

                            <label htmlFor="checkbox" className="sr-only">
                              Checkbox
                            </label>
                          </div>
                        </th>
                        {column.map((item) => (
                          <th
                            key={item.id}
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-left text-neutral-600 uppercase text-left"
                          >
                            <div
                              className="flex gap-3 cursor-pointer items-center"
                              onClick={() =>
                                setQuery((prev) => ({
                                  ...prev,
                                  sort: item.id,
                                  order:
                                    query.sort === item.id &&
                                    query.order === "ASC"
                                      ? "DESC"
                                      : "ASC",
                                }))
                              }
                            >
                              <p>{item.name}</p>
                              {query.sort === item.id && (
                                <FontAwesomeIcon
                                  icon={
                                    query.order === "ASC"
                                      ? faArrowUp
                                      : faArrowDown
                                  }
                                />
                              )}
                            </div>
                          </th>
                        ))}
                        <th
                          scope="col"
                          className="p-4 lg:p-4 text-xs font-bold text-right text-neutral-600 uppercase"
                        >
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentsMethod.data.map((data) => (
                        <tr
                          key={data.id}
                          onClick={() => handleRowSelect(data.id)}
                          className={`${
                            selected.includes(data.id)
                              ? "bg-gray-100"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          <td className="py-3 pl-4">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                name={data.id}
                                id={data.id}
                                checked={selected.includes(data.id)}
                                onChange={() => handleRowSelect(data.id)}
                                className="h-4 w-4 cursor-pointer"
                              />
                              <label htmlFor="checkbox" className="sr-only">
                                Checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-4 items-center">
                              <div className="h-10 aspect-square flex items-center">
                                <Image
                                  src={data.logo}
                                  alt={`Logo ${data.name}`}
                                  width="0"
                                  height="0"
                                  sizes="100vw"
                                  style={{ width: "100%", height: "100%" }}
                                  className="rounded-lg object-contain"
                                />
                              </div>
                              <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                                {data.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.isActive ? "Aktif" : "Tidak Aktif"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {data.feeType === FeeType.AMOUNT &&
                              formatter(data.fee)}
                            {data.feeType !== FeeType.AMOUNT && data.fee + " %"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatter(data.minAmount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatter(data.maxAmount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="flex justify-end w-full">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowForm(true);
                                  setTypeForm("detail");
                                  setPaymentDetail(data);
                                }}
                                className="bg-primary-900 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-600"
                              >
                                Lihat
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            onPageChange={handlePageClick}
            page={paymentsMethod.page}
            limit={paymentsMethod.limit}
            total={paymentsMethod.total}
            totalPage={paymentsMethod.totalPage}
          />
        </div>
      )}
    </>
  );
};

export default TablePaymentMethod;
