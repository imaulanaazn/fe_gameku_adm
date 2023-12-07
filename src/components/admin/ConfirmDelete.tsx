"use client";

import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

interface IConfirmDeleteProps {
    path: string;
    method: "PUT" | "DELETE" | "POST";
    field?: string;
    getNewData?: () => Promise<void>;
}

const ConfirmDelete: React.FC<IConfirmDeleteProps> = ({ path, method, field, getNewData }) => {
    const [valueConfirmDelete, setValueConfirmDelete] = useState("");
    const [loading, setLoading] = useState(false);

    const setShowDelete = useSetRecoilState(showDeleteState);
    const [selected, setSelected] = useRecoilState(selectedAdminState);
    const textConfirmDelete = "SAYA SANGAT YAKIN";

    const deleteBulk = async () => {
        setLoading(true);
        const id = toast.loading("Sedang menghapus data...");
        let option: RequestInit = {};
        if (method !== "DELETE" && field) {
            option.body = JSON.stringify({
                [field]: selected,
            });
        } else {
            const selectedId = selected.join(",");
            path = path + "/" + selectedId;
        }

        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, {
            cache: "no-cache",
            method,
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            ...option,
        });

        if (req.ok) {
            getNewData && (await getNewData());
            setSelected([]);
            toast.update(id, {
                render: "Berhasil menghapus data",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            const res = await req.json();
            toast.update(id, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }

        setShowDelete(false);
        setLoading(false);
    };

    const handleDeleteBulk = (e: any) => {
        e.preventDefault();
        deleteBulk();
    };

    return (
        <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10]">
            <div className="md:w-1/3 w-full bg-white shadow-lg opacity-100 p-3 rounded-lg">
                <div className="w-full border-b-2 py-2 flex justify-between">
                    <h1 className="font-bold font-montserrat text-base">Apakah Kamu Yakin?</h1>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer"
                        size="xl"
                        onClick={() => setShowDelete(false)}
                    />
                </div>
                <p className="mt-2">Apakah kamu yakin ingin menghapus ini? Jika kamu yakin ketik teks dibawah ini!</p>
                <div className="w-full py-4 bg-gray-300 px-2 rounded-md font-bold mt-3 select-none">
                    {textConfirmDelete}
                </div>
                <form onSubmit={handleDeleteBulk}>
                    <input
                        type="text"
                        name="confirm"
                        id="confim"
                        autoComplete="off"
                        value={valueConfirmDelete}
                        onChange={(e) => setValueConfirmDelete(e.target.value)}
                        className="py-3 px-2 w-full border-2 mt-3 rounded-md border-gray-800 focus:outline-none focus:border-gray-300"
                    />
                    <button
                        type="submit"
                        className={`w-full px-2 py-3 bg-[#B72025] text-white mt-3 rounded-md ${
                            (valueConfirmDelete !== textConfirmDelete || loading) && "opacity-50"
                        }`}
                        disabled={valueConfirmDelete !== textConfirmDelete || loading}
                    >
                        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        {!loading && `Delete ${selected.length} items`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmDelete;
