"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faMagnifyingGlass,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/(admin)/admin/game/loading";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import Pagination from "@/components/admin/Pagination";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { voucherAdminState } from "@/atom/voucherAdminState";
import FormVoucherGame from "./FormVoucherGame";
import Select from "react-select";

const tableVG = [
  {
    id: "gameName",
    name: "Game",
  },
  {
    id: "code",
    name: "Voucher",
  },
  {
    id: "used",
    name: "Status",
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

const optionsFilterStatus = [
  {
    label: "Digunakan",
    value: "true",
  },
  {
    label: "Belum Digunakan",
    value: "false",
  },
];

const TableVoucherGame: React.FC<{ data: IVoucherGamePagination }> = ({
  data,
}) => {
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
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [detailData, setDetailData] = useState<IVoucherGame | undefined>();
  const [inputSearch, setInputSearch] = useState("");

  const [optionsFilterGame, setOptionFilterGame] = useState<
    { label: string | undefined; value: string | undefined }[] | null
  >(null);
  const [optionsFilterProduct, setOptionFilterProduct] = useState<
    { label: string | undefined; value: string | undefined }[] | null
  >(null);

  const [selectedFilterGame, setSelectedFilterGame] = useState<{
    label: string | undefined;
    value: string | undefined;
  } | null>(null);
  const [selectedFilterProduct, setSelectedFilterProduct] = useState<{
    label: string | undefined;
    value: string | undefined;
  } | null>(null);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedFilterLimit, setSelectedFilterLimit] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [newData, setNewData] = useRecoilState(voucherAdminState);
  const [selected, setSelected] = useRecoilState(selectedAdminState);
  const [showDelete, setShowDelete] = useRecoilState(showDeleteState);

  const getNewData = async () => {
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
        "/v1/voucher-game?" +
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
      setNewData({
        data: res.data,
        keySearch: newData.keySearch,
        order: res.order,
        limit: res.limit,
        page: res.page,
        sort: res.sort,
        total: res.total,
        totalPage: res.totalPage,
      });
    }

    setLoading(false);
  };

  const getGames = async () => {
    setLoading(true);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/game/attr?conditional=voucherType:internal",
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
      setOptionFilterGame(
        res.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }

    setLoading(false);
  };

  const getDenoms = async (conditional?: string) => {
    if (conditional) {
      conditional = "&conditional=" + conditional;
    }
    setLoading(true);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/denom/attr?isVoucherInternal=true" +
        (conditional ? conditional : ""),
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
      setOptionFilterProduct(
        res.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }

    setLoading(false);
  };

  const handlePageClick = ({ selected }: { selected: any }) => {
    setQuery((prev) => ({
      ...prev,
      page: selected + 1,
    }));
  };

  const handleClickSearch = () => {
    setQuery((prev) => {
      const check = prev.search.findIndex((item) => item.key === "code");
      if (check !== -1) {
        prev.search[check].value = inputSearch;
      } else {
        prev.search.push({
          key: "code",
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

    setSelectedFilterGame(null);
    setSelectedFilterProduct(null);
    setSelectedFilterStatus(null);
    setSelectedFilterLimit(null);
  };

  useEffect(() => {
    getNewData();
    const checkGameId = query.search.find((item) => item.key === "gameId");
    if (checkGameId) {
      getDenoms("gameId:" + checkGameId.value);
    }
  }, [JSON.stringify(query), query.search.length]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelected(newData.data.map((item) => item.id));
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

  useEffect(() => {
    setSelected([]);
    getGames();
    getDenoms();
  }, []);

  useEffect(() => {
    if (newData.data.length === selected.length && newData.data.length !== 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [newData.data.length, selected.length, selectAll]);

  return (
    <>
      {showForm && (
        <FormVoucherGame
          handleShowForm={(value: boolean) => setShowForm(value)}
          getNewData={getNewData}
          type={typeForm}
          dataDetail={detailData}
        />
      )}
      {showDelete && (
        <ConfirmDelete
          path="/v1/voucher-game"
          method="DELETE"
          getNewData={getNewData}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-xl p-6 lg:p-8">
          <div
            className={`${selected.length > 0 ? "bg-green-200" : "bg-white"}`}
          >
            {selected.length === 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">Voucher</p>
                <div className="flex gap-2">
                  <div
                    onClick={() => {
                      setShowForm(!showForm);
                      setTypeForm("add");
                    }}
                    className="shrink-0 flex justify-between py-3 px-4 gap-5 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
                  >
                    <p>Voucher Baru</p>
                    <FontAwesomeIcon icon={faPlus} size="lg" />
                  </div>
                </div>
              </div>
            )}
            {selected.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold text-green-600">
                  {selected.length} Selected
                </p>
                <div>
                  <div className="relative">
                    <div
                      onClick={() => setShowDelete(true)}
                      className="bg-red-800 hover:bg-red-600 w-10 h-10 rounded-full cursor-pointer grid place-content-center"
                      data-tooltip-id="tooltip-delete"
                      data-tooltip-content="Hapus"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="xl"
                        className="text-white"
                      />
                    </div>
                    <ReactTooltip
                      id="tooltip-delete"
                      style={{
                        fontSize: "12px",
                        padding: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col xl:flex-row justify-between mt-4 gap-4">
            <div className="relative w-full lg:w-max border border-primary-900 bg-primary-50 rounded-md overflow-hidden flex items-center">
              <input
                placeholder={`Cari Voucher`}
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                className="w-full py-2 border-none bg-transparent text-primary-900 placeholder:text-primary-900 focus:ring-transparent"
              />
              <button
                type="button"
                disabled={!inputSearch}
                onClick={(e) => handleClickSearch()}
                className="pr-4 hover:cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-primary-900 text-lg"
                />
              </button>
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              {optionsFilterStatus && (
                <div>
                  <Select
                    id="filterStatus"
                    value={selectedFilterStatus}
                    onChange={(e: any) => {
                      const data = {
                        key: "used",
                        value: e.value,
                      };
                      setQuery((prev) => {
                        const check = prev.search.find(
                          (item) => item.key === "used"
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
                    options={optionsFilterStatus}
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
              )}
              {optionsFilterGame && (
                <div>
                  <Select
                    id="filterGame"
                    value={selectedFilterGame}
                    onChange={(e: any) => {
                      const data = {
                        key: "gameId",
                        value: e.value,
                      };
                      setQuery((prev) => {
                        const check = prev.search.find(
                          (item) => item.key === "gameId"
                        );
                        if (check) {
                          check.value = e.value;
                        } else {
                          prev.search.push(data);
                        }
                        prev.page = 1;
                        return prev;
                      });
                      setSelectedFilterGame(e);
                    }}
                    options={optionsFilterGame}
                    placeholder="Filter Game"
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
              )}
              {optionsFilterProduct && (
                <div>
                  <Select
                    id="filterDenom"
                    value={selectedFilterProduct}
                    onChange={(e: any) => {
                      const data = {
                        key: "productId",
                        value: e.value,
                      };
                      setQuery((prev) => {
                        const check = prev.search.find(
                          (item) => item.key === "productId"
                        );
                        if (check) {
                          check.value = e.value;
                        } else {
                          prev.search.push(data);
                        }
                        prev.page = 1;
                        return prev;
                      });
                      setSelectedFilterProduct(e);
                    }}
                    options={optionsFilterProduct}
                    placeholder="Filter Denom"
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
              )}
              {optionLimit && (
                <div>
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
              )}
              <button
                onClick={() => handleClickClearButton()}
                className="px-4 py-2 aspect-square rounded-md text-white bg-primary-900 hover:bg-red-600 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-8">
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
                      {tableVG.map((item) => (
                        <th
                          key={item.id}
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
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
                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {newData.data.map((data) => (
                      <tr
                        key={data.id}
                        onClick={() => handleRowSelect(data.id)}
                        className={`${
                          selected.includes(data.id)
                            ? "bg-gray-200"
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
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          <div className="flex gap-3 items-center">
                            <div className="h-10 aspect-square flex items-center">
                              <Image
                                src={data.game?.logoUrl || ""}
                                alt={`Voucher ${data.game?.name}`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: "100%", height: "100%" }}
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-base">
                                {data.game?.name}
                              </p>
                              <p>{data.product?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {data.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {data.used ? "Digunakan" : "Belum digunakan"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          <div className="flex justify-end w-full">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowForm(true);
                                setTypeForm("detail");
                                setDetailData(data);
                              }}
                              className="bg-green-600 px-4 py-2 rounded-md text-white cursor-pointer"
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
          <Pagination
            onPageChange={handlePageClick}
            page={newData.page}
            limit={newData.limit}
            total={newData.total}
            totalPage={newData.totalPage}
          />
        </div>
      )}
    </>
  );
};

export default TableVoucherGame;
