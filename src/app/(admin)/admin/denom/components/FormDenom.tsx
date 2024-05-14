"use client";

import {
  faRepeat,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import Select from "react-select";
import Image from "next/image";
import { toast } from "react-toastify";
import formatter from "@/lib/formatter";
import { Tooltip as ReactTooltip } from "react-tooltip";
registerLocale("id", id);

interface IForm {
  handleShowForm: (value: boolean) => void;
  getNewData: () => void;
  type?: string;
  data?: IProductsGame;
  hideEdit?: boolean;
}

const FormDenom: React.FC<IForm> = ({
  handleShowForm,
  getNewData,
  type,
  data,
  hideEdit,
}) => {
  const [optionGame, setOptionGame] = useState<
    { label: string; value: string }[]
  >([]);
  const inputFileLogoDenom = useRef<HTMLInputElement | null>(null);
  const [hoverImageLogoDenom, setHoverImageLogoDenom] = useState(false);
  const [newData, setNewData] = useState({
    priceBuy: 0,
    code: "",
    name: "",
    price: 0,
    logoDenom: "",
    gameId: "",
    fileImageLogoDenom: {} as any,
  });

  const [priceBuy, setPriceBuy] = useState("");
  const [price, setPrice] = useState("");

  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [disableButtonSubmit, setDisableButtonSubmit] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState<"active" | "archive">("active");

  const saveData = async () => {
    setLoading(true);
    const toastId = toast.loading(
      `Sedang ${typeForm === "edit" ? "mengubah" : "menyimpan"} data...`
    );
    const formData = new FormData();
    if (typeForm === "edit" && data) {
      formData.append("id", data.id);
    }
    if (
      (typeForm === "edit" && newData.logoDenom !== data?.logoDenom) ||
      (typeForm === "add" && Object.keys(newData.fileImageLogoDenom).length > 0)
    ) {
      formData.append("logoDenom", newData.fileImageLogoDenom);
    }

    formData.append("priceBuy", newData.priceBuy.toString());
    formData.append("code", newData.code);
    formData.append("name", newData.name);
    formData.append("price", newData.price.toString());
    formData.append("gameId", newData.gameId);
    formData.append("status", typeSubmit === "active" ? "active" : "archive");

    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom", {
      cache: "no-cache",
      method: typeForm === "edit" ? "PUT" : "POST",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    if (req.ok) {
      getNewData();
      toast.update(toastId, {
        render: `Berhasil ${
          typeForm === "edit" ? "Mengubah" : "Menambahkan"
        } Data Denom`,
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

  const getGames = async () => {
    setLoading(true);
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
      setOptionGame(
        res.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }

    setLoading(false);
  };

  // useEffect(() => {
  //     if (
  //         (typeForm === "add" || typeForm === "edit") &&
  //         (!priceBuy ||
  //             !newData.name ||
  //             !newData.code ||
  //             !price ||
  //             !newData.gameId ||
  //             (typeForm === "edit" &&
  //                 newData.name === data?.name &&
  //                 newData.code === data?.code &&
  //                 price === data?.price.toString() &&
  //                 priceBuy === data?.priceBuy?.toString() &&
  //                 newData.gameId === data?.gameId &&
  //                 newData.logoDenom === data?.logoDenom))
  //     ) {
  //         setDisableButtonSubmit(true);
  //     } else {
  //         setDisableButtonSubmit(false);
  //     }
  // }, [newData.name, newData.code, price, priceBuy, newData.logoDenom, newData.gameId, newData.logoDenom, typeForm]);

  useEffect(() => {
    getGames();
    if (type !== "add" && data) {
      setNewData({
        name: data.name,
        code: data.code,
        price: data.price,
        priceBuy: data.priceBuy || 0,
        gameId: data.gameId,
        logoDenom: data.logoDenom,
        fileImageLogoDenom: {} as any,
      });

      setPrice(data.price.toString() || "");
      setPriceBuy(data.priceBuy?.toString() || "");
    }

    setTypeForm(type || "");
  }, []);

  useEffect(() => {
    if (type !== "add") {
      const checkGame = optionGame.find((item) => item.value === data?.gameId);
      if (checkGame) {
        setSelectedGame(checkGame);
      }
    }
  }, [JSON.stringify(optionGame)]);

  const handleClick = (type: "logoDenom") => {
    if (type === "logoDenom" && inputFileLogoDenom.current) {
      inputFileLogoDenom.current.click();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logoDenom"
  ) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      displayImage(selectedFile, type);
    }
  };

  const displayImage = (file: File, type: "logoDenom") => {
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg"
    ) {
      return toast.error("Format gambar tidak didukung", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        let data = {};

        data = {
          logoDenom: imageSrc,
          fileImageLogoDenom: file,
        };

        setNewData((prev) => ({
          ...prev,
          ...data,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveData();
  };

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50">
      <div className="md:w-2/5 w-full bg-white shadow p-8 rounded-xl overflow-y-hidden relative">
        <div className="flex justify-between border-b-2 pb-4 border-gray-200 items-center">
          <h1 className="text-xl font-medium text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Denom Baru"
              : typeForm === "edit"
              ? `Ubah Denom ${data?.name}`
              : `Detail Denom ${data?.name}`}
          </h1>
          <div
            onClick={() => handleShowForm(false)}
            className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-primary-900 group-hover:text-white transition-all"
            />
          </div>
        </div>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div className="w-full flex mt-4 gap-4">
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Logo Denom
              </label>
              <div className="w-[140px] aspect-square mt-4">
                {newData.logoDenom ? (
                  <div
                    onMouseEnter={() => setHoverImageLogoDenom(true)}
                    onMouseLeave={() => setHoverImageLogoDenom(false)}
                    className="w-[140px] aspect-square mt-4 relative"
                  >
                    {hoverImageLogoDenom && typeForm !== "detail" && (
                      <div className="w-full h-full flex absolute bg-gray-800 bg-opacity-70 items-center justify-evenly p-2 rounded-md">
                        <button
                          data-tooltip-id="tooltip-delete"
                          data-tooltip-content="Hapus"
                          onClick={() => {
                            setNewData((prev) => ({
                              ...prev,
                              logoDenom: "",
                            }));
                            setHoverImageLogoDenom(false);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-white text-lg"
                          />
                          <ReactTooltip
                            id="tooltip-delete"
                            style={{
                              fontSize: "12px",
                              padding: "10px",
                            }}
                          />
                        </button>
                        {type === "detail" &&
                          data &&
                          data?.logoDenom !== newData.logoDenom && (
                            <button
                              data-tooltip-id="tooltip-reset"
                              data-tooltip-content="Reset"
                              onClick={() => {
                                setNewData((prev) => ({
                                  ...prev,
                                  logoDenom: data.logoDenom,
                                }));
                                setHoverImageLogoDenom(false);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faRepeat}
                                className="text-white text-lg"
                              />
                              <ReactTooltip
                                id="tooltip-reset"
                                data-tooltip-content="Reset"
                                style={{
                                  fontSize: "12px",
                                  padding: "10px",
                                }}
                              />
                            </button>
                          )}
                      </div>
                    )}
                    {newData.logoDenom && (
                      <Image
                        src={newData.logoDenom}
                        alt={"Logo Denom"}
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-lg object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {typeForm === "detail" ? (
                      <div className="w-full h-full bg-white border-2 rounded flex items-center justify-center p-4 text-xs text-neutral-600 text-center border-dashed border-gray-400">
                        Tidak ada logo denom
                      </div>
                    ) : (
                      <div
                        onClick={(e) => handleClick("logoDenom")}
                        className="w-[140px] aspect-square mt-4 border-2 border-dashed border-primary-900 flex justify-center items-center bg-primary-50"
                      >
                        <input
                          type="file"
                          name="imageLogoDenom"
                          id="imageLogoDenom"
                          accept=".png, .jpg, .jpeg"
                          hidden
                          readOnly={typeForm === "detail"}
                          ref={inputFileLogoDenom}
                          onChange={(e) =>
                            handleFileInputChange(e, "logoDenom")
                          }
                        />
                        <p className="text-gray-600 text-center text-xs p-4">
                          Click here to upload
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 gap-4 w-full">
            <label
              htmlFor="name"
              className="font-medium text-base text-neutral-900 inline-block"
            >
              Produk{" "}
              {typeForm !== "detail" && (
                <span className="text-red-800 font-bold">*</span>
              )}
            </label>
            <div className="w-full mt-2">
              {optionGame.length > 0 && (
                <Select
                  id="gameCategory"
                  value={selectedGame}
                  onChange={(e: any) => {
                    setNewData((prev) => ({
                      ...prev,
                      gameId: e.value,
                    }));

                    setSelectedGame(e);
                  }}
                  options={optionGame}
                  isDisabled={typeForm === "detail"}
                  placeholder="Game"
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
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Nama Denom{" "}
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
                  placeholder="Mobile Legends"
                  autoComplete="off"
                  value={newData.name}
                  onChange={(e) => {
                    setNewData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
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
                Kode Denom
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={true}
                  required
                  type="text"
                  name="code"
                  id="code"
                  placeholder="ML10"
                  autoComplete="off"
                  value={newData.code}
                  onChange={(e) =>
                    setNewData((prev) => ({ ...prev, code: e.target.value }))
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
            <div className="w-1/2">
              <label
                htmlFor="priceBuy"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Harga Beli{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={true}
                  required
                  type="text"
                  name="priceBuy"
                  id="priceBuy"
                  placeholder="Rp. 10000"
                  autoComplete="off"
                  value={priceBuy && formatter(parseInt(priceBuy))}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPriceBuy(value);
                    setNewData((prev) => ({
                      ...prev,
                      priceBuy: parseInt(value),
                    }));
                  }}
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
                htmlFor="price"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Harga Jual{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={typeForm === "detail"}
                  required
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Rp. 10000"
                  autoComplete="off"
                  value={price && formatter(parseInt(price))}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPrice(value);
                    setNewData((prev) => ({
                      ...prev,
                      price: parseInt(value),
                    }));
                  }}
                  className={`${
                    typeForm === "detail"
                      ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                      : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                  } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-4 flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="name">
                                Harga Beli <span className="text-red-800 font-bold">*</span>{" "}
                            </label>
                            <div className="w-full mt-2">
                                <Select
                                    id="gameCategory"
                                    value={selectedCategoryId}
                                    onChange={(e: any) => {
                                        setNewData((prev) => ({
                                            ...prev,
                                            categoryId: e.value,
                                        }));

                                        setSelectedCategoryId(e);
                                    }}
                                    options={CATEGORY_ID_OPTIONS}
                                    isDisabled={typeForm === "detail"}
                                    placeholder="Game Kategori"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: "#333",
                                            cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? "#007BFF" : "white",
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
                        <div className="w-1/2">
                            <label htmlFor="name">
                                Tipe Game <span className="text-red-800 font-bold">*</span>{" "}
                            </label>
                            <div className="w-full mt-2">
                                <Select
                                    id="gameType"
                                    value={selectedGameType}
                                    onChange={(e: any) => {
                                        setNewData((prev) => ({
                                            ...prev,
                                            type: e.value,
                                        }));

                                        setSelectedGameType(e);
                                    }}
                                    options={GAME_TYPE_OPTIONS}
                                    isDisabled={typeForm === "detail"}
                                    placeholder="Tipe Game"
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: "#333",
                                            cursor: typeForm === "detail" ? "not-allowed" : "pointer",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected ? "#007BFF" : "white",
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
                    </div> */}

          {typeForm === "detail" && !hideEdit && (
            <div className="flex justify-end gap-4 bg-white  mt-4">
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
            <div className="flex justify-end gap-4 bg-white mt-4">
              {loading ? (
                <>
                  <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
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
                    type="submit"
                    id="archive"
                    onClick={() => setTypeSubmit("archive")}
                    disabled={disableButtonSubmit}
                    className={`${
                      disableButtonSubmit
                        ? "bg-opacity-50 cursor-not-allowed"
                        : "bg-opacity-100 hover:bg-orange-400"
                    } bg-orange-600  text-white font-semibold px-3 py-3 rounded-md`}
                  >
                    Simpan sebagai arsip
                  </button>
                  <button
                    onClick={() => handleShowForm(false)}
                    type="button"
                    className="bg-primary-50 hover:bg-primary-900 hover:text-white text-primary-900 font-medium w-24 py-3 rounded-md border border-primary-900 transition-all"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    id="save"
                    onClick={() => setTypeSubmit("active")}
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

export default FormDenom;
