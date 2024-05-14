"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ISocialMedia } from "@/interfaces/socialMedia";
import * as brands from "@fortawesome/free-brands-svg-icons";

interface IForm {
  handleShowForm: (value: boolean) => void;
  getNewData: () => void;
  type?: string;
  dataSocialMedia?: ISocialMedia;
}

const FormSocialMedia: React.FC<IForm> = ({
  handleShowForm,
  getNewData,
  type,
  dataSocialMedia,
}) => {
  const [data, setData] = useState<{
    name: string;
    icon: string;
    url: string;
  }>({
    name: "",
    icon: "",
    url: "",
  });

  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);
  const [brandsIcon, setBrandsIcon] = useState<string[]>([]);
  const [svgBrandsIcon, setSvgBrandsIcon] = useState<any>({});

  const postData = async () => {
    let body = JSON.stringify(data);
    if (typeForm === "edit") {
      body = JSON.stringify({ ...data, id: dataSocialMedia?.id });
    }
    setLoading(true);
    const toastId = toast.loading(
      typeForm === "edit"
        ? "Sedang mengubah data button social media..."
        : "Sedang menyimpan data button social media..."
    );
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/sosmed", {
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
        } Data Button Social Media`,
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

  const handleCreateData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData();
  };

  useEffect(() => {
    if (
      (typeForm === "add" || typeForm === "edit") &&
      (!data.name ||
        !data.icon ||
        !data.url ||
        (typeForm === "edit" &&
          data.name === dataSocialMedia?.name &&
          data.icon === dataSocialMedia?.icon &&
          data.url === dataSocialMedia?.url))
    ) {
      setDisableButtonSubmit(true);
    } else {
      setDisableButtonSubmit(false);
    }
  }, [data.name, typeForm, data.icon, data.url]);

  useEffect(() => {
    if (type !== "add" && dataSocialMedia) {
      setData({
        name: dataSocialMedia.name,
        icon: dataSocialMedia.icon,
        url: dataSocialMedia.url,
      });
    }

    setTypeForm(type || "");

    const newDataBrands = { ...brands } as any;
    delete newDataBrands.prefix;
    delete newDataBrands.fab;

    setSvgBrandsIcon(newDataBrands);
    setBrandsIcon(Object.keys(newDataBrands));
  }, []);

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50 py-8">
      <div className="md:w-3/4 lg:w-2/5 h-screen md:h-max md:max-h-full w-full bg-white p-6 lg:p-8 md:rounded-xl overflow-y-auto relative">
        <div className="flex justify-between border-b-2 py-2 border-gray-200 items-center">
          <h1 className="text-xl">
            {typeForm === "add"
              ? "Tambah Button Social Media Baru"
              : typeForm === "edit"
              ? `Ubah Button ${dataSocialMedia?.name}`
              : `Detail Button ${dataSocialMedia?.name}`}
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
        <form onSubmit={handleCreateData}>
          <div className="flex flex-col lg:flex-row gap-4 py-3">
            <div className="flex flex-col gap-2 w-full lg:w-1/2">
              <label
                htmlFor="image"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Pilih Icon{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <div
                className={`w-full border h-52 ${
                  typeForm !== "detail"
                    ? "border-primary-900 bg-primary-50"
                    : "bg-gray-100 border-transparent"
                } flex items-center justify-center rounded-md flex-wrap overflow-y-scroll`}
              >
                {brandsIcon.length > 0 &&
                  brandsIcon.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (typeForm !== "detail") {
                          setData((prev) => ({ ...prev, icon: item }));
                        }
                      }}
                      className={`${
                        item === data.icon
                          ? "bg-[#B72025] text-white"
                          : "bg-transparent"
                      } w-10 h-10 rounded flex items-center justify-center ${
                        typeForm !== "detail" &&
                        "hover:bg-gray-400 cursor-pointer"
                      }`}
                    >
                      <FontAwesomeIcon icon={svgBrandsIcon[item]} size="xl" />
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div>
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Nama{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nama"
                    autoComplete="off"
                    value={data.name}
                    readOnly={typeForm === "detail"}
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
              <div className="mt-4">
                <label
                  htmlFor="url"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Social Media Url{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="Nama"
                    autoComplete="off"
                    required={true}
                    value={data.url}
                    readOnly={typeForm === "detail"}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, url: e.target.value }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                        : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                    } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                  />
                </div>
              </div>
              <div className="mt-4 items-center">
                <p className="font-medium text-base text-neutral-900 inline-block">
                  Icon :
                </p>
                {data.icon && (
                  <div
                    className={`mt-2 bg-[#B72025] text-white w-10 h-10 rounded flex items-center justify-center`}
                  >
                    <FontAwesomeIcon
                      icon={svgBrandsIcon[data.icon]}
                      size="xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {typeForm === "detail" && (
            <div className="mt-4 flex justify-end gap-4">
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
            <div className="mt-4 flex justify-end gap-4">
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

export default FormSocialMedia;
