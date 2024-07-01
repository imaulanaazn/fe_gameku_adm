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

const FormYoutubeVideo: React.FC<IFormAddBanner> = ({
  handleShowForm,
  getNewData,
  type,
  dataVideo,
}) => {
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
      typeForm === "edit"
        ? "Sedang mengubah data youtube video..."
        : "Sedang menyimpan data youtube video..."
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
        render: `Berhasil ${
          typeForm === "edit" ? "Mengubah" : "Menambahkan"
        } Data Youtube Video`,
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
      (!data.urlVideo ||
        (typeForm === "edit" && data.urlVideo === dataVideo?.url))
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
    <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-50 py-8 px-4 md:px-0">
      <div className="md:w-3/4 lg:w-2/5 w-full bg-white shadow p-8 rounded-xl overflow-y-hidden relative">
        <div className="flex justify-between border-b-2 pb-4 border-gray-200 items-center">
          <h1 className="text-xl font-medium text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Youtube Video Baru"
              : typeForm === "edit"
              ? `Ubah Youtube Video`
              : `Detail Youtube Video`}
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
        <form onSubmit={handleCreatePromoCode}>
          <div className="mt-3 flex flex-col gap-3">
            <label
              htmlFor="code"
              className="font-medium text-base text-neutral-900 inline-block"
            >
              Link Youtube Video
            </label>
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
                  typeForm === "detail"
                    ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                    : "focus:bg-primary-50 text-primary-900 border border-solid border-primary-900 focus:ring-0 focus:border-primary-900"
                } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
              />
            </div>
          </div>
          {typeForm === "detail" && (
            <div className="flex justify-end bg-white mt-4">
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
            <div className="flex gap-4 justify-end mt-4">
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
                    className="hover:bg-primary-900 hover:text-white text-primary-900 font-medium w-24 py-3 rounded-md border border-primary-900 transition-all"
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

export default FormYoutubeVideo;
