"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import { IPromotion } from "@/interfaces/promotion";
import { DiscountType } from "@/enum";
import Select from "react-select";
import dayjs from "dayjs";
import formatter from "@/lib/formatter";
registerLocale("id", id);

interface IForm {
  handleShowForm: (value: boolean) => void;
  getNewData: () => void;
  type?: string;
  dataPromotion?: IPromotion;
  hideEdit?: boolean;
}

const DISC_TYPE_OPTIONS = [
  {
    label: "RP",
    value: "AMOUNT",
  },
  {
    label: "%",
    value: "PERCENTAGE",
  },
];

const FormAddPromoCode: React.FC<IForm> = ({
  handleShowForm,
  getNewData,
  type,
  dataPromotion,
  hideEdit,
}) => {
  const [data, setData] = useState<{
    code: string;
    gameId: string;
    name: string;
    discType: string;
    discValue: number;
    minPurchase: number;
    stock: number;
    maxDiscount: number;
    description: string;
    startAt: Date | null;
    endAt: Date | null;
  }>({
    code: "",
    gameId: "",
    name: "",
    discType: "",
    discValue: 0,
    minPurchase: 0,
    stock: 0,
    maxDiscount: 0,
    description: "",
    startAt: null,
    endAt: null,
  });

  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOptionPromoType, setSelectedOptionPromoType] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedOptionGame, setSelectedOptionGame] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [discValue, setDiscValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [stock, setStock] = useState("");
  const [maxDisc, setMaxDisc] = useState("");
  const [game, setGame] = useState<{ label: string; value: string }[]>([]);
  const [checkSpesificGame, setCheckSpesificGame] = useState(false);
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

  const postPromoCode = async () => {
    setLoading(true);
    setLoading(true);
    const toastId = toast.loading(
      typeForm === "edit"
        ? "Sedang mengubah data kode promo..."
        : "Sedang menyimpan data kode promo..."
    );
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/promo-code",
      {
        cache: "no-cache",
        method: typeForm === "edit" ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          ...data,
          ...(typeForm === "edit" && { id: dataPromotion?.id }),
        }),
      }
    );

    if (req.ok) {
      getNewData();
      toast.update(toastId, {
        render: `Berhasil ${
          typeForm === "edit" ? "Mengubah" : "Menambahkan"
        } Data Kode Promo`,
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render: res.message,
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
    handleShowForm(false);
  };

  const handleCreatePromoCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postPromoCode();
  };

  const getGames = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/attr",
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
      const data = res.map((data: any) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      setGame(data);
    }
  };

  const handleChangeSpesificGame = () => {
    setCheckSpesificGame(!checkSpesificGame);

    if (game.length === 0) {
      getGames();
    }
  };

  useEffect(() => {
    if (!checkSpesificGame) {
      setSelectedOptionGame(null);
    }
  }, [checkSpesificGame]);

  useEffect(() => {
    if (
      (typeForm === "add" || typeForm === "edit") &&
      (!data.code ||
        !data.discType ||
        !data.discValue ||
        !data.endAt ||
        !data.name ||
        !data.startAt ||
        (checkSpesificGame && !data.gameId) ||
        (typeForm === "edit" &&
          data.discType === dataPromotion?.discountType.toUpperCase() &&
          data.discValue === dataPromotion?.discountValue &&
          data.endAt?.toISOString() === dataPromotion?.endAt &&
          data.name === dataPromotion?.name &&
          data.startAt?.toISOString() === dataPromotion?.startAt &&
          checkSpesificGame &&
          data.gameId &&
          data.gameId === dataPromotion.gameId &&
          data.description === dataPromotion.description))
    ) {
      setDisableButtonSubmit(true);
    } else {
      setDisableButtonSubmit(false);
    }
  }, [
    data.code,
    data.discType,
    data.discValue,
    data.endAt,
    data.name,
    data.startAt,
    data.minPurchase,
    checkSpesificGame,
    data.gameId,
    typeForm,
    data.description,
  ]);

  useEffect(() => {
    if (discValue) {
      setData((prev) => ({ ...prev, discValue: parseInt(discValue) }));
    }
  }, [discValue]);

  useEffect(() => {
    if (minPurchase) {
      setData((prev) => ({ ...prev, minPurchase: parseInt(minPurchase) }));
    }
  }, [minPurchase]);

  useEffect(() => {
    if (maxDisc) {
      setData((prev) => ({ ...prev, maxDiscount: parseInt(maxDisc) }));
    }
  }, [maxDisc]);

  useEffect(() => {
    if (stock) {
      setData((prev) => ({ ...prev, stock: parseInt(stock) }));
    }
  }, [stock]);

  useEffect(() => {
    getGames();
    if (type !== "add" && dataPromotion) {
      setData({
        code: dataPromotion.code,
        gameId: dataPromotion.gameId,
        name: dataPromotion.name,
        discType: dataPromotion.discountType.toUpperCase(),
        discValue: dataPromotion.discountValue || 0,
        minPurchase: dataPromotion.minPurchase || 0,
        maxDiscount: dataPromotion.maxDiscount || 0,
        description: dataPromotion.code,
        startAt: dayjs(dataPromotion.startAt).toDate(),
        endAt: dayjs(dataPromotion.endAt).toDate(),
        stock: dataPromotion.stock || 0,
      });

      setStock(dataPromotion?.stock?.toString() || "0");
      setMinPurchase(dataPromotion?.minPurchase?.toString() || "0");
      const promoType = DISC_TYPE_OPTIONS.find(
        (item) => item.value === dataPromotion.discountType.toUpperCase()
      );
      if (promoType) {
        setSelectedOptionPromoType(promoType);
      }
      setMaxDisc(dataPromotion?.maxDiscount?.toString() || "0");
      setDiscValue(dataPromotion?.discountValue?.toString() || "0");
    }

    setTypeForm(type || "");
  }, []);

  useEffect(() => {
    if (type !== "add" && dataPromotion) {
      const checkGame = game.find(
        (item) => item.value === dataPromotion.gameId
      );
      if (checkGame) {
        setCheckSpesificGame(true);
        setSelectedOptionGame(checkGame);
      }
    }
  }, [game]);

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50 py-10">
      <div className="xl:w-2/5 lg:w-1/2 md:w-3/4 h-screen md:h-auto md:max-h-full w-full bg-white p-6 lg:p-8 md:rounded-xl overflow-y-auto overflow-x-hidden relative">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Kode Promo Baru"
              : typeForm === "edit"
              ? `Ubah Kode Promo ${dataPromotion?.name}`
              : `Detail Kode Promo ${dataPromotion?.name}`}
          </h1>
          <div
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
            onClick={() => handleShowForm(false)}
          >
            <div className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all">
              <FontAwesomeIcon
                icon={faTimes}
                className="text-primary-900 group-hover:text-white transition-all"
              />
            </div>
          </div>
        </div>
        <form onSubmit={handleCreatePromoCode}>
          <div className="mt-8 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="code"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Kode Promo{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={typeForm === "detail"}
                  required
                  type="text"
                  name="code"
                  id="code"
                  placeholder="KODE123"
                  autoComplete="off"
                  value={data.code}
                  onChange={(e) =>
                    setData((prev) => {
                      const code = e.target.value
                        .toUpperCase()
                        .replace(/[^a-zA-Z0-9_]/g, "");

                      return { ...prev, code };
                    })
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Nama Promo
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={typeForm === "detail"}
                  required
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Event 10.10"
                  autoComplete="off"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-full">
              <label
                htmlFor="description"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Deskripsi
              </label>
              <div className="w-full mt-2">
                <textarea
                  name="description"
                  id="description"
                  cols={30}
                  rows={10}
                  disabled={typeForm === "detail"}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } resize-none w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="discValue"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Potongan{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={typeForm === "detail"}
                  required
                  type="text"
                  name="discValue"
                  id="discValue"
                  placeholder="10000"
                  autoComplete="off"
                  value={
                    discValue && data.discType
                      ? data.discType === "PERCENTAGE"
                        ? discValue + " %"
                        : formatter(parseInt(discValue))
                      : discValue
                  }
                  onChange={(e) =>
                    setDiscValue(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Tipe{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <Select
                  id="promoCode"
                  value={selectedOptionPromoType}
                  onChange={(e: any) => {
                    setData((prev) => ({
                      ...prev,
                      discType: e.value,
                    }));

                    setSelectedOptionPromoType(e);
                  }}
                  options={DISC_TYPE_OPTIONS}
                  isDisabled={typeForm === "detail"}
                  placeholder="Tipe Potongan"
                  defaultValue={DISC_TYPE_OPTIONS[0]}
                  styles={{
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: typeForm === "detail" ? "#cccccc" : "#b72025",
                    }),
                    control: (provided, state) => ({
                      ...provided,
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      color: "#4B5563",
                      backgroundColor:
                        typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                      "&:hover": {
                        backgroundColor:
                          typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                      },
                      cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                      border:
                        typeForm === "detail" ? "none" : "1px solid #B72025",
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: typeForm === "detail" ? "#4B5563" : "#B72025",
                      cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#B72025" : "white",
                      color: state.isSelected ? "white" : "#333",
                      cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                      ":hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }),
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="code"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Minimal Pembelian
              </label>
              <div className="w-full">
                <input
                  disabled={typeForm === "detail"}
                  type="text"
                  name="minPurchase"
                  id="minPurchase"
                  placeholder="10000"
                  autoComplete="off"
                  value={minPurchase && formatter(parseInt(minPurchase))}
                  onChange={(e) =>
                    setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="code"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Stok
              </label>
              <div className="w-full">
                <input
                  disabled={typeForm === "detail"}
                  type="text"
                  name="stok"
                  id="stok"
                  placeholder="100"
                  autoComplete="off"
                  value={stock && stock}
                  onChange={(e) =>
                    setStock(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
          </div>

          {data.discType === DiscountType.PERCENTAGE.toUpperCase() && (
            <div className="mt-4 flex flex-col gap-4">
              <label
                htmlFor="code"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Max Potongan
              </label>
              <div className="w-full">
                <input
                  disabled={typeForm === "detail"}
                  type="text"
                  name="maxDisc"
                  id="maxDisc"
                  placeholder="10000"
                  autoComplete="off"
                  value={
                    maxDisc &&
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(parseInt(maxDisc))
                  }
                  onChange={(e) =>
                    setMaxDisc(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100"
                      : "bg-white bg-opacity-100"
                  } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
          )}
          <div className="mt-4">
            <p className="font-medium text-base text-neutral-900 inline-block">
              Pilih Durasi{" "}
              {typeForm === "add" && (
                <span className="text-red-800 font-bold">*</span>
              )}
            </p>
            <div className="w-full flex gap-2 items-center mt-2">
              <DatePicker
                selected={data.startAt}
                onChange={(date) =>
                  setData((prev) => {
                    return { ...prev, startAt: date };
                  })
                }
                selectsStart
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="d MMMM yyyy HH:mm"
                startDate={data.startAt}
                endDate={data.endAt}
                minDate={new Date()}
                locale="id"
                wrapperClassName="w-1/2"
                placeholderText="Tanggal Dimulai"
                isClearable={!(typeForm === "detail")}
                disabled={typeForm === "detail"}
                className={`${
                  typeForm === "detail"
                    ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                    : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
              />
              <p>-</p>
              <DatePicker
                selected={data.endAt}
                onChange={(date) =>
                  setData((prev) => ({ ...prev, endAt: date }))
                }
                selectsEnd
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                timeCaption="Time"
                dateFormat="d MMMM yyyy HH:mm"
                startDate={data.startAt}
                endDate={data.endAt}
                minDate={data.startAt}
                locale="id"
                wrapperClassName="w-1/2"
                placeholderText="Tanggal Selesai"
                isClearable={!(typeForm === "detail")}
                disabled={typeForm === "detail"}
                clearButtonClassName="bg-primary-900"
                className={`${
                  typeForm === "detail"
                    ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                    : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <input
              disabled={typeForm === "detail"}
              type="checkbox"
              name="spesificGame"
              id="spesificGame"
              checked={checkSpesificGame}
              onChange={() => handleChangeSpesificGame()}
              className={
                typeForm === "detail" ? "cursor-not-allowed" : "cursor-pointer"
              }
            />
            <label
              htmlFor="spesificGame"
              className={`text-sm text-neutral-700
                ${
                  typeForm === "detail"
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              Buat kode promo untuk game tertentu
            </label>
          </div>
          <div className="mt-2 flex flex-col gap-4">
            <Select
              id="game"
              value={selectedOptionGame}
              onChange={(e: any) => {
                setData((prev) => ({
                  ...prev,
                  gameId: e.value,
                }));

                setSelectedOptionGame(e);
              }}
              options={game}
              placeholder="Pilih Game"
              styles={{
                dropdownIndicator: (base) => ({
                  ...base,
                  color: typeForm === "detail" ? "#cccccc" : "#b72025",
                }),
                control: (provided, state) => ({
                  ...provided,
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  color: "#4B5563",
                  backgroundColor:
                    typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                  "&:hover": {
                    backgroundColor:
                      typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                  },
                  cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                  border: typeForm === "detail" ? "none" : "1px solid #B72025",
                }),
                singleValue: (provided, state) => ({
                  ...provided,
                  color: typeForm === "detail" ? "#4B5563" : "#B72025",
                  cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#B72025" : "white",
                  color: state.isSelected ? "white" : "#333",
                  cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                  ":hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }),
              }}
              className="w-full"
              isDisabled={
                !checkSpesificGame || game.length === 0 || typeForm === "detail"
              }
            />
          </div>
          {typeForm === "detail" && !hideEdit && (
            <div className="flex justify-end space-x-2 bg-white py-5">
              <button
                onClick={() => setTypeForm("edit")}
                type="button"
                className={
                  "bg-primary-900 hover:bg-red-600 text-white font-medium w-24 py-3 rounded-md transition-all"
                }
              >
                Edit
              </button>
            </div>
          )}
          {typeForm !== "detail" && (
            <div className="flex justify-end bg-white mt-4 gap-4">
              {loading ? (
                <>
                  <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                  <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleShowForm(false)}
                    type="button"
                    className="bg-primary-50 hover:bg-primary-900 hover:text-white text-primary-900 font-medium w-24 py-3 rounded-md border border-primary-900 transition-all"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={disableButtonSubmit}
                    className={`${
                      disableButtonSubmit
                        ? "bg-opacity-50 cursor"
                        : "bg-opacity-100 hover:bg-red-600"
                    } bg-primary-900 text-white font-medium w-24 py-3 rounded-md transition-all`}
                  >
                    Simpan
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAddPromoCode;
