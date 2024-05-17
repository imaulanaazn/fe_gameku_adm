"use client";

import { selectedAdminState } from "@/atom/selectedAdminState";
import { showDeleteState } from "@/atom/showDeleteState";
import {
  faSpinner,
  faTimes,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
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

const ConfirmDelete: React.FC<IConfirmDeleteProps> = ({
  path,
  method,
  field,
  getNewData,
}) => {
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
    <div className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50 p-4">
      <div className="md:w-1/4 w-full bg-white shadow-lg opacity-100 p-8 rounded-xl">
        <div
          onClick={() => setShowDelete(false)}
          className="group w-8 h-8 ml-auto flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all"
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="text-primary-900 group-hover:text-white text-xl"
            size="xl"
          />
        </div>
        <div className="bg-primary-100 p-4 rounded-full w-max mx-auto my-4">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-primary-900 group-hover:text-white text-3xl"
          />
        </div>
        <h1 className="font-bold text-center text-base text-neutral-800">
          Apakah Kamu Yakin?
        </h1>
        <p className="mt-2 text-center text-neutral-600">
          Apakah kamu yakin ingin menghapus ini? <br /> Jika ya, ketik teks
          dibawah ini!
        </p>
        <div className="w-full py-4 bg-primary-100 px-2 rounded-md font-semibold mt-4 select-none text-primary-900 text-center">
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
            className="py-3 px-2 w-full border mt-4 rounded-md border-primary-900 focus:outline-none focus:border-gray-300 bg-primary-50 text-sm placeholder:text-sm text-primary-900 placeholder:text-primary-900"
          />
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className={`w-max px-4 py-3 bg-[#B72025] text-white mt-4 rounded-md ${
                valueConfirmDelete !== textConfirmDelete || loading
                  ? "opacity-50"
                  : "hover:bg-red-500"
              }`}
              disabled={valueConfirmDelete !== textConfirmDelete || loading}
            >
              {loading && <FontAwesomeIcon icon={faSpinner} spin />}
              {!loading && `Delete ${selected.length} items`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDelete;
