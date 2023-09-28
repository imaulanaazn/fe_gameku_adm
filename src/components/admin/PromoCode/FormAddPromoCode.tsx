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
registerLocale("id", id);

interface IFormAddBanner {
    handleShowForm: (value: boolean) => void;
    getNewData: () => void;
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
] as any[];

const FormAddPromoCode: React.FC<IFormAddBanner> = ({ handleShowForm, getNewData }) => {
    const [data, setData] = useState<{
        code: string;
        gameId: string;
        name: string;
        discType: string;
        discValue: number;
        minPurchase: number;
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
        description: "",
        startAt: null,
        endAt: null,
    });
    const [loading, setLoading] = useState(false);
    const [selectedOptionPromoType, setSelectedOptionPromoType] = useState("");
    const [selectedOptionGame, setSelectedOptionGame] = useState("");
    const [discValue, setDiscValue] = useState("");
    const [minPurchase, setMinPurchase] = useState("");
    const [game, setGame] = useState<{ label: string; value: string }[]>([]);
    const [checkSpesificGame, setCheckSpesificGame] = useState(false);
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const postPromoCode = async () => {
        setLoading(true);
        const toastId = toast.loading("Sedang menyimpan data promo...");
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/promo-code", {
            cache: "no-cache",
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(data),
        });

        if (req.ok) {
            getNewData();
            toast.update(toastId, {
                render: "Berhasil Menambahkan Data Promo",
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
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/game/attr", {
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

    const handleChangeSpesificGame = () => {
        setCheckSpesificGame(!checkSpesificGame);

        if (game.length === 0) {
            getGames();
        }
    };

    useEffect(() => {
        if (!checkSpesificGame) {
            setSelectedOptionGame("");
        }
    }, [checkSpesificGame]);

    useEffect(() => {
        if (
            !data.code ||
            !data.discType ||
            !data.discValue ||
            !data.endAt ||
            !data.name ||
            !data.startAt ||
            (checkSpesificGame && !data.gameId)
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
        console.log(data);
    }, [data]);

    return (
        <div
            onDrop={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10"
        >
            <div className="md:w-1/2 md:max-h-full w-full bg-white shadow-lg p-4 rounded-lg overflow-y-auto relative">
                <div className="flex justify-between border-b-2 py-2 border-gray-600 items-center">
                    <h1 className="text-xl">Tambah Kode Promo Baru</h1>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={() => handleShowForm(false)} />
                </div>
                <form onSubmit={handleCreatePromoCode}>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="code">
                                Kode Promo <span className="text-red-800 font-bold">*</span>{" "}
                            </label>
                            <div className="w-full mt-2">
                                <input
                                    required
                                    type="text"
                                    name="code"
                                    id="code"
                                    placeholder="KODE123"
                                    autoComplete="off"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                                    }
                                    className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="name">
                                Nama Promo <span className="text-red-800 font-bold">*</span>{" "}
                            </label>
                            <div className="w-full mt-2">
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Event 10.10"
                                    autoComplete="off"
                                    value={data.name}
                                    onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-full">
                            <label htmlFor="description">Deskripsi</label>
                            <div className="w-full mt-2">
                                <textarea
                                    name="description"
                                    id="description"
                                    cols={30}
                                    rows={10}
                                    className="resize-none border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md p-3 w-full"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-3/4">
                            <label htmlFor="discValue">
                                Potongan <span className="text-red-800 font-bold">*</span>{" "}
                            </label>
                            <div className="w-full mt-2">
                                <input
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
                                                : new Intl.NumberFormat("id-ID", {
                                                      style: "currency",
                                                      currency: "IDR",
                                                      minimumFractionDigits: 0,
                                                      maximumFractionDigits: 0,
                                                  }).format(parseInt(discValue))
                                            : discValue
                                    }
                                    onChange={(e) => setDiscValue(e.target.value.replace(/[^0-9]/g, ""))}
                                    className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                                />
                            </div>
                        </div>
                        <div className="w-1/4">
                            <label htmlFor="name">
                                Tipe <span className="text-red-800 font-bold">*</span>{" "}
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
                                    placeholder="Tipe Potongan"
                                    defaultValue={DISC_TYPE_OPTIONS[0]}
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
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                        <label htmlFor="code">Minimal Pembelian</label>
                        <div className="w-full">
                            <input
                                type="text"
                                name="discValue"
                                id="discValue"
                                placeholder="10000"
                                autoComplete="off"
                                value={
                                    minPurchase &&
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(parseInt(minPurchase))
                                }
                                onChange={(e) => setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))}
                                className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p>
                            Pilih Durasi <span className="text-red-800 font-bold">*</span>{" "}
                        </p>
                        <div className="w-full flex gap-2 items-center mt-2">
                            <DatePicker
                                selected={data.startAt}
                                onChange={(date) => setData((prev) => ({ ...prev, startAt: date }))}
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
                                isClearable
                                className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                            />
                            <p>-</p>
                            <DatePicker
                                selected={data.endAt}
                                onChange={(date) => setData((prev) => ({ ...prev, endAt: date }))}
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
                                isClearable
                                clearButtonClassName="bg-red-500"
                                className="border-2 border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full"
                            />
                        </div>
                        {/* <div className="w-full">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nama"
                                autoComplete="off"
                                value={data.name}
                                onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                                className="py-3 px-2 w-full border-2 mt-2 rounded-md border-gray-600 focus:outline-none focus:border-blue-600"
                            />
                        </div> */}
                    </div>
                    <div className="mt-3 flex gap-3">
                        <input
                            type="checkbox"
                            name="spesificGame"
                            id="spesificGame"
                            checked={checkSpesificGame}
                            onChange={() => handleChangeSpesificGame()}
                            className="cursor-pointer"
                        />
                        <label htmlFor="spesificGame" className="cursor-pointer">
                            Buat kode promo untuk game tertentu
                        </label>
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
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
                            isDisabled={!checkSpesificGame || game.length === 0}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 sticky -bottom-4 bg-white py-5">
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
                                    disabled={disableButtonSubmit}
                                    type="submit"
                                    className={`bg-green-600 text-white font-semibold w-24 py-3 rounded-md ${
                                        disableButtonSubmit ? "opacity-50" : "hover:bg-green-400"
                                    }`}
                                >
                                    Simpan
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAddPromoCode;
