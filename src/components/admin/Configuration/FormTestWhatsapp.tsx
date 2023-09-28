"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

interface IFormTestWhatsapp {
    handleShowForm: (value: boolean) => void;
}

const FormTestWhatsapp: React.FC<IFormTestWhatsapp> = ({ handleShowForm }) => {
    const [listTemplate, setListTemplate] = useState([]);
    const [selectedMessageType, setSelectedMessageType] = useState("");
    const [data, setData] = useState<{
        mobileNumber: string;
        messageType: string;
    }>({
        mobileNumber: "",
        messageType: "",
    });

    const postTestWhatsapp = async () => {
        const toastId = toast.loading("SSedang mengirim whatsapp untuk test");
        const searchParams = new URLSearchParams();
        searchParams.append("mobileNumber", data.mobileNumber);
        searchParams.append("messageType", data.messageType);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/whatsapp-test?" + searchParams.toString(), {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (req.ok) {
            toast.update(toastId, {
                render: "Berhasil Mengirim Whatsapp Test",
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
        handleShowForm(false);
    };

    const getListTemplate = async () => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/whatsapp", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await request.json();
        if (request.ok) {
            setListTemplate(res);
        }
    };

    const handleTestWhatsapp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postTestWhatsapp();
    };

    useEffect(() => {
        getListTemplate();
    }, []);

    return (
        <div className="absolute top-0 left-0 right-0 h-screen bg-black bg-opacity-20 flex items-center justify-center">
            <div className="p-4 bg-white rounded-md w-1/3">
                <form onSubmit={handleTestWhatsapp}>
                    <h1 className="text-lg font-semibold pb-4 border-b-2">Test Whatsapp</h1>
                    <div className="mt-4 flex flex-col">
                        <label htmlFor="mobileNumber">Nomor Whatsapp Tujuan</label>
                        <input
                            type="text"
                            placeholder="089123456789"
                            required
                            name="mobileNumber"
                            id="mobileNumber"
                            className="py-3 px-2 w-full border-2 mt-2 rounded-md border-gray-600 focus:outline-none focus:border-blue-600"
                            autoComplete="off"
                            value={data.mobileNumber}
                            onChange={(e) => setData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                        />
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label htmlFor="messageType">Pilih Contoh Pesan</label>
                        <Select
                            id="messageType"
                            value={selectedMessageType}
                            onChange={(e: any) => {
                                setData((prev) => ({
                                    ...prev,
                                    messageType: e.value,
                                }));

                                setSelectedMessageType(e);
                            }}
                            options={listTemplate}
                            placeholder="Pilih Contoh Pesan"
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
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="flex items-center justify-end space-x-3 mt-4">
                        <button
                            onClick={() => handleShowForm(false)}
                            type="button"
                            className="px-5 py-3 bg-gray-300 hover:bg-gray-100 rounded-md shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!data.messageType && !data.mobileNumber}
                            type="submit"
                            className={`px-5 py-3 rounded-md shadow-md ${
                                !data.messageType && !data.mobileNumber && "opacity-50 hover:bg-green-600"
                            } bg-green-600 text-white hover:bg-green-400`}
                        >
                            Kirim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTestWhatsapp;
