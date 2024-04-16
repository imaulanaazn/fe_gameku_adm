"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import Select from "react-select";
import Image from "next/image";
import { toast } from "react-toastify";
import formatter from "@/lib/formatter";
registerLocale("id", id);

interface IForm {
    handleShowForm: (value: boolean) => void;
    getNewData: () => void;
    type?: string;
    data?: IproductCategory;
    hideEdit?: boolean;
}

const FormCategoryProduct: React.FC<IForm> = ({ handleShowForm, getNewData, type, data, hideEdit }) => {
    const [optionGame, setOptionGame] = useState<{ label: string; value: string }[]>([]);
    const [newData, setNewData] = useState({
        name: "",
    });

    const [typeForm, setTypeForm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedDenom, setSelectedDenom] = useState<
        | {
              label: string;
              value: string;
          }[]
        | null
    >(null);

    const [disableButtonSubmit, setDisableButtonSubmit] = useState(false);
    const [typeSubmit, setTypeSubmit] = useState<"active">("active");

    const saveData = async () => {
        setLoading(true);
        const toastId = toast.loading(`Sedang ${typeForm === "edit" ? "mengubah" : "menyimpan"} data...`);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/product-category", {
            cache: "no-cache",
            method: typeForm === "edit" ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                ...(typeForm === "edit" && data && { id: data.id }),
                name: newData.name,
                gameId: selectedGame,
                productsId: selectedDenom,
            }),
        });

        if (req.ok) {
            getNewData();
            toast.update(toastId, {
                render: `Berhasil ${typeForm === "edit" ? "Mengubah" : "Menambahkan"} Data Kategori Product`,
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/attr", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setOptionGame(
                res.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                })),
            );
        }

        setLoading(false);
    };
    useEffect(() => {
        getGames();
        if (type !== "add" && data) {
            setNewData({
                name: data.name,
            });
        }

        setTypeForm(type || "");
    }, []);

    // useEffect(() => {
    //     if (type !== "add") {
    //         const checkGame = optionGame.find((item) => item.value === data?.gameId);
    //         if (checkGame) {
    //             setSelectedGame(checkGame);
    //         }
    //     }
    // }, [JSON.stringify(optionGame)]);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveData();
    };

    return (
        <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10">
            <div className="md:w-3/4 md:max-h-full w-full bg-white shadow p-4 rounded overflow-y-auto relative">
                <div className="flex justify-between border-b-2 py-2 border-gray-300 items-center">
                    <h1 className="text-xl">
                        {typeForm === "add"
                            ? "Tambah Denom Baru"
                            : typeForm === "edit"
                            ? `Ubah Denom ${data?.name}`
                            : `Detail Denom ${data?.name}`}
                    </h1>
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
                        onClick={() => handleShowForm(false)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    {/* <div className="w-full flex mt-3 gap-3">
                        <div className="w-1/2">
                            <label htmlFor="name">Logo Denom</label>
                            <div className="w-[150px] aspect-square mt-3">
                                {newData.logoDenom ? (
                                    <div
                                        onMouseEnter={() => setHoverImageLogoDenom(true)}
                                        onMouseLeave={() => setHoverImageLogoDenom(false)}
                                        className="w-[150px] aspect-square mt-3 relative"
                                    >
                                        {hoverImageLogoDenom && typeForm !== "detail" && (
                                            <div className="w-full h-full absolute bg-gray-800 bg-opacity-30 flex flex-col gap-2 items-center justify-end p-2">
                                                <button
                                                    onClick={() => {
                                                        setNewData((prev) => ({
                                                            ...prev,
                                                            logoDenom: "",
                                                        }));
                                                        setHoverImageLogoDenom(false);
                                                    }}
                                                    className="bg-white px-4 py-3"
                                                >
                                                    Remove Image
                                                </button>
                                                {type === "detail" && data && data?.logoDenom !== newData.logoDenom && (
                                                    <button
                                                        onClick={() => {
                                                            setNewData((prev) => ({
                                                                ...prev,
                                                                logoDenom: data.logoDenom,
                                                            }));
                                                            setHoverImageLogoDenom(false);
                                                        }}
                                                        className="bg-white px-4 py-3 rounded-md"
                                                    >
                                                        Set Default
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
                                            <div className="w-full h-full bg-white border rounded flex items-center justify-center">
                                                Tidak ada logo denom
                                            </div>
                                        ) : (
                                            <div
                                                onClick={(e) => handleClick("logoDenom")}
                                                className="w-[150px] aspect-square mt-3 border border-dotted flex justify-center items-center"
                                            >
                                                <input
                                                    type="file"
                                                    name="imageLogoDenom"
                                                    id="imageLogoDenom"
                                                    accept=".png, .jpg, .jpeg"
                                                    hidden
                                                    readOnly={typeForm === "detail"}
                                                    ref={inputFileLogoDenom}
                                                    onChange={(e) => handleFileInputChange(e, "logoDenom")}
                                                />
                                                <p className="text-gray-400 font-bold">Click here to upload</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div> */}
                    <div className="mt-3 gap-3 w-full">
                        <label htmlFor="name">
                            Produk <span className="text-red-800 font-bold">*</span>{" "}
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
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="name">
                                Nama Denom <span className="text-red-800 font-bold">*</span>{" "}
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
                                            ? "cursor-not-allowed bg-gray-100"
                                            : "bg-white bg-opacity-100"
                                    } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="priceBuy">
                                Harga Beli <span className="text-red-800 font-bold">*</span>{" "}
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
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="price">
                                Harga Jual <span className="text-red-800 font-bold">*</span>{" "}
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
                                            ? "cursor-not-allowed bg-gray-100"
                                            : "bg-white bg-opacity-100"
                                    } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>

                    {typeForm === "detail" && !hideEdit && (
                        <div className="flex justify-end space-x-2 sticky -bottom-4 bg-white py-5">
                            <button
                                onClick={() => setTypeForm("edit")}
                                type="button"
                                className="bg-green-600 hover:bg-green-400 text-white font-semibold w-24 py-3 rounded-md"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                    {typeForm !== "detail" && (
                        <div className="flex justify-end space-x-2 sticky -bottom-4 bg-white py-5">
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
                                        onClick={() => handleShowForm(false)}
                                        type="button"
                                        className="bg-gray-600 hover:bg-gray-400 text-white font-semibold w-24 py-3 rounded-md"
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
                                                ? "bg-opacity-50 cursor-not-allowed"
                                                : "bg-opacity-100 hover:bg-green-400"
                                        } bg-green-600  text-white font-semibold w-24 py-3 rounded-md`}
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="submit"
                                        id="archive"
                                        onClick={() => setTypeSubmit("archive")}
                                        disabled={disableButtonSubmit}
                                        className={`${
                                            disableButtonSubmit
                                                ? "bg-opacity-50 cursor-not-allowed"
                                                : "bg-opacity-100 hover:bg-yellow-400"
                                        } bg-yellow-600  text-white font-semibold px-3 py-3 rounded-md`}
                                    >
                                        Simpan sebagai arsip
                                    </button>
                                </>
                            )}
                        </div>
                    )} */}
                </form>
            </div>
        </div>
    );
};

export default FormCategoryProduct;
