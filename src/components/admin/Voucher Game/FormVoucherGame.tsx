"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

interface IFormAdmin {
    handleShowForm: (value: boolean) => void;
    getNewData: () => void;
    type?: string;
    dataDetail?: IVoucherGame;
}

const FormVoucherGame: React.FC<IFormAdmin> = ({ handleShowForm, getNewData, type, dataDetail }) => {
    const [data, setData] = useState<{
        gameId: string;
        productId: string;
        code: string | string[];
    }>({
        gameId: "",
        productId: "",
        code: "",
    });
    const [selectedOptionGame, setSelectedOptionGame] = useState<{ label: string; value: string } | null>(null);
    const [selectedOptionProduct, setSelectedOptionProduct] = useState<{ label: string; value: string } | null>(null);
    const [game, setGame] = useState<{ label: string; value: string }[]>([]);
    const [product, setProduct] = useState<{ label: string; value: string }[]>([]);
    const [typeForm, setTypeForm] = useState("");
    const [loading, setLoading] = useState(false);
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const postData = async () => {
        let body = JSON.stringify(data);
        if (typeForm === "edit") {
            body = JSON.stringify({ ...data, id: dataDetail?.id });
        }
        setLoading(true);
        const toastId = toast.loading(
            typeForm === "edit" ? "Sedang mengubah data voucher game..." : "Sedang menyimpan data voucher game...",
        );
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/voucher-game", {
            cache: "no-cache",
            method: typeForm === "edit" ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body,
        });

        if (req.ok) {
            getNewData();
            toast.update(toastId, {
                render: `Berhasil ${typeForm === "edit" ? "Mengubah" : "Menambahkan"} Data Voucher Game`,
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game/attr?conditional=voucher_type:internal", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

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

    const getProducts = async (gameId: string) => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/denom/attr?conditional=game_id:" + gameId, {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            const data = res.map((data: any) => {
                return {
                    label: data.name,
                    value: data.id,
                };
            });
            setProduct(data);
        }
    };

    const handleCreatePromoCode = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postData();
    };

    useEffect(() => {
        if (
            (typeForm === "add" || typeForm === "edit") &&
            (!data.gameId ||
                !data.productId ||
                !data.code ||
                (typeForm === "edit" &&
                    data.gameId === dataDetail?.gameId &&
                    data.productId === dataDetail.productId &&
                    data.code === dataDetail.code))
        ) {
            setDisableButtonSubmit(true);
        } else {
            setDisableButtonSubmit(false);
        }
    }, [data.gameId, data.productId, data.code, typeForm]);

    useEffect(() => {
        if (type !== "add" && dataDetail) {
            setData({
                gameId: dataDetail.gameId,
                productId: dataDetail.productId,
                code: dataDetail.code,
            });
        }

        setTypeForm(type || "");
        getGames();
    }, []);

    useEffect(() => {
        data.gameId && getProducts(data.gameId);
    }, [data.gameId]);

    useEffect(() => {
        if (type !== "add" && dataDetail) {
            const checkGame = game.find((item) => item.value === dataDetail.gameId);
            if (checkGame) {
                setSelectedOptionGame(checkGame);
            }
        }
    }, [game]);

    useEffect(() => {
        if (type !== "add" && dataDetail) {
            const checkProduct = product.find((item) => item.value === dataDetail.productId);
            if (checkProduct) {
                setSelectedOptionProduct(checkProduct);
            }
        }
    }, [product]);

    return (
        <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10">
            <div className="md:w-3/4 md:max-h-full w-full bg-white shadow p-4 rounded overflow-y-auto relative">
                <div className="flex justify-between border-b-2 py-2 border-gray-300 items-center">
                    <h1 className="text-xl">
                        {typeForm === "add"
                            ? "Tambah Voucher Game Baru"
                            : typeForm === "edit"
                            ? `Ubah Voucher Game`
                            : `Detail Voucher Game`}
                    </h1>
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
                        onClick={() => handleShowForm(false)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <form onSubmit={handleCreatePromoCode}>
                    <div className="flex gap-4 py-3">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="code">
                                Kode Voucher {typeForm === "add" && "(Bisa lebih dari 1)"}{" "}
                                <span className="text-red-800 font-bold">*</span>
                            </label>
                            {typeForm === "add" && (
                                <div className="w-full">
                                    <textarea
                                        name="code"
                                        id="code"
                                        cols={30}
                                        rows={10}
                                        value={data.code}
                                        onChange={(e) => setData((prev) => ({ ...prev, code: e.target.value }))}
                                        placeholder={`XXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX`}
                                        className={`bg-white bg-opacity-100 h-full resize-none overflow-y-auto border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                    />
                                </div>
                            )}

                            {typeForm !== "add" && (
                                <div className="w-full">
                                    <input
                                        disabled={typeForm === "detail"}
                                        required
                                        type="text"
                                        name="code"
                                        id="code"
                                        placeholder="10000"
                                        autoComplete="off"
                                        value={data.code}
                                        onChange={(e) => setData((prev) => ({ ...prev, code: e.target.value }))}
                                        className={`${
                                            typeForm === "detail"
                                                ? "cursor-not-allowed bg-gray-100"
                                                : "bg-white bg-opacity-100"
                                        } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-1/2">
                            <div>
                                <label htmlFor="game">
                                    Pilih Game <span className="text-red-800 font-bold">*</span>{" "}
                                </label>
                                <div className="w-full mt-2">
                                    <Select
                                        id="game"
                                        name="game"
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
                                            control: (provided, state) => ({
                                                ...provided,
                                                paddingTop: "6px",
                                                paddingBottom: "6px",
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: "#333",
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected ? "#007BFF" : "white",
                                                color: state.isSelected ? "white" : "#333",
                                                cursor: "pointer",
                                                ":hover": {
                                                    backgroundColor: "#f0f0f0",
                                                },
                                            }),
                                        }}
                                        className="w-full"
                                        isDisabled={game.length === 0 || typeForm === "detail"}
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="denom">
                                    Pilih Denom <span className="text-red-800 font-bold">*</span>{" "}
                                </label>
                                <div className="w-full mt-2">
                                    <Select
                                        id="denom"
                                        name="denom"
                                        value={selectedOptionProduct}
                                        onChange={(e: any) => {
                                            setData((prev) => ({
                                                ...prev,
                                                productId: e.value,
                                            }));

                                            setSelectedOptionProduct(e);
                                        }}
                                        options={product}
                                        placeholder="Pilih Denom"
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                paddingTop: "6px",
                                                paddingBottom: "6px",
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: "#333",
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected ? "#007BFF" : "white",
                                                color: state.isSelected ? "white" : "#333",
                                                cursor: "pointer",
                                                ":hover": {
                                                    backgroundColor: "#f0f0f0",
                                                },
                                            }),
                                        }}
                                        className="w-full"
                                        isDisabled={!data.gameId || !product || typeForm === "detail"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {typeForm === "detail" && (
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
                        <div className="flex justify-end space-x-2  py-5">
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
                                        className="bg-gray-600 hover:bg-gray-400 text-white font-semibold w-24 py-3 rounded-md"
                                    >
                                        Batalkan
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={disableButtonSubmit}
                                        className={`${
                                            disableButtonSubmit
                                                ? "bg-opacity-50 cursor-not-allowed"
                                                : "bg-opacity-100 hover:bg-green-400"
                                        } bg-green-600  text-white font-semibold w-24 py-3 rounded-md`}
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

export default FormVoucherGame;
