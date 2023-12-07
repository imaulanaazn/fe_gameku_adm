"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { INewsVideos } from "@/interfaces/newsVideo";

interface IFormAddBanner {
    handleShowForm: (value: boolean) => void;
    getNewData: () => void;
    type?: string;
    dataVideo?: INewsVideos;
}

const FormPosts: React.FC<IFormAddBanner> = ({ handleShowForm, getNewData, type, dataVideo }) => {
    const [data, setData] = useState<{
        urlVideo: string;
    }>({
        urlVideo: "",
    });

    const [typeForm, setTypeForm] = useState("");
    const [loading, setLoading] = useState(false);
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const postData = async () => {
        let body = JSON.stringify(data);
        if (typeForm === "edit") {
            body = JSON.stringify({ ...data, id: dataVideo?.id });
        }
        setLoading(true);
        const toastId = toast.loading(
            typeForm === "edit" ? "Sedang mengubah data youtube video..." : "Sedang menyimpan data youtube video...",
        );
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/youtube", {
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
                render: `Berhasil ${typeForm === "edit" ? "Mengubah" : "Menambahkan"} Data Youtube Video`,
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
        postData();
    };

    useEffect(() => {
        if (
            (typeForm === "add" || typeForm === "edit") &&
            (!data.urlVideo || (typeForm === "edit" && data.urlVideo === dataVideo?.url))
        ) {
            setDisableButtonSubmit(true);
        } else {
            setDisableButtonSubmit(false);
        }
    }, [data.urlVideo, typeForm]);

    useEffect(() => {
        if (type !== "add" && dataVideo) {
            setData({
                urlVideo: dataVideo.url,
            });
        }

        setTypeForm(type || "");
    }, []);

    return (
        <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10">
            <div className="md:w-3/4 md:max-h-full w-full bg-white shadow p-4 rounded overflow-y-auto relative">
                <div className="flex justify-between border-b-2 py-2 border-gray-300 items-center">
                    <h1 className="text-xl">
                        {typeForm === "add"
                            ? "Tambah Youtube Video Baru"
                            : typeForm === "edit"
                            ? `Ubah Youtube Video`
                            : `Detail Youtube Video`}
                    </h1>
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
                        onClick={() => handleShowForm(false)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <form onSubmit={handleCreatePromoCode}>
                    <div className="mt-3 flex flex-col gap-3">
                        <label htmlFor="code">Link Youtube Video</label>
                        <div className="w-full">
                            <input
                                disabled={typeForm === "detail"}
                                type="text"
                                name="youtubeUrl"
                                id="youtubeUrl"
                                placeholder="http://www.youtube.com/watch?v=xxxxxxxxx"
                                autoComplete="off"
                                value={data.urlVideo}
                                onChange={(e) =>
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            urlVideo: e.target.value,
                                        };
                                    })
                                }
                                className={`${
                                    typeForm === "detail" ? "cursor-not-allowed bg-gray-100" : "bg-white bg-opacity-100"
                                } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                            />
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

export default FormPosts;
