"use client";

import { IImageCarousel } from "@/interfaces/carousels";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface IFormAddBanner {
  handleShowForm: (value: boolean) => void;
  getBanners: () => void;
  type?: string;
  dataBanner?: IImageCarousel;
}

const FormAddBanner: React.FC<IFormAddBanner> = ({
  handleShowForm,
  getBanners,
  type,
  dataBanner,
}) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [data, setData] = useState({
    selectedImage: "",
    name: "",
    eventUrl: "",
    external: "",
    fileImage: {} as any,
  });
  const [hoverImage, setHoverImage] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);

  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    displayImage(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      displayImage(selectedFile);
    }
  };

  const displayImage = (file: File) => {
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
        setData({ ...data, selectedImage: imageSrc, fileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBanner = async (method: "PUT" | "POST") => {
    setLoading(true);
    const id = toast.loading("Sedang menyimpan data...");
    const formData = new FormData();
    if (typeForm === "edit" && dataBanner) {
      formData.append("id", dataBanner.id);
    }

    if (
      (typeForm === "edit" && data.selectedImage !== dataBanner?.imageUrl) ||
      typeForm === "add"
    ) {
      formData.append("bannerImage", data.fileImage);
    }
    formData.append("name", data.name);
    formData.append("eventUrl", data.eventUrl);

    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/banner", {
      method,
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    const res = await req.json();
    if (req.ok) {
      getBanners();
      toast.update(id, {
        render: `Berhasil ${
          typeForm === "add" ? "Menambahkan" : "Mengubah"
        } Data Banner`,
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.update(id, {
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

  const handleAddBanner = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveBanner(typeForm === "add" ? "POST" : "PUT");
  };

  useEffect(() => {
    if (type !== "add" && dataBanner) {
      setData({
        selectedImage: dataBanner.imageUrl,
        name: dataBanner.name,
        eventUrl: dataBanner.eventUrl,
        external: "",
        fileImage: {} as any,
      });
    }

    setTypeForm(type || "");
  }, []);

  useEffect(() => {
    if (typeForm === "edit") {
      if (
        !data.selectedImage ||
        !data.name ||
        (data.selectedImage === dataBanner?.imageUrl &&
          data.eventUrl === dataBanner.eventUrl &&
          data.name === dataBanner.name)
      ) {
        setDisabledButton(true);
      } else {
        setDisabledButton(false);
      }

      return;
    }

    if (typeForm === "add") {
      if (!data.selectedImage || !data.name) {
        setDisabledButton(true);
      } else {
        setDisabledButton(false);
      }

      return;
    }
  }, [data.selectedImage, data.eventUrl, data.name, typeForm]);

  return (
    <div
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50"
    >
      <div className="md:w-max h-screen md:h-max lg:h-auto md:max-h-screen w-full bg-white p-8  md:rounded-xl">
        <div className="flex justify-between mb-6 lg:mb-8 items-center">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Banner Baru"
              : typeForm === "edit"
              ? `Ubah Banner ${dataBanner?.name}`
              : `Detail Banner ${dataBanner?.name}`}
          </h1>
          <div
            className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all"
            onClick={() => handleShowForm(false)}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-primary-900 group-hover:text-white text-xl"
            />
          </div>
        </div>
        <form onSubmit={handleAddBanner}>
          <div className="">
            <div className="flex flex-col gap-2">
              {typeForm === "edit" && (
                <label
                  htmlFor="image"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Pilih Gambar <span className="text-red-800 font-bold">*</span>
                </label>
              )}
              {data.selectedImage ? (
                <div
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}
                  className="w-full h-52 flex items-center justify-center relative"
                >
                  {hoverImage && typeForm !== "detail" && (
                    <div className="flex items-center justify-center gap-4 w-full h-full absolute bg-gray-800 bg-opacity-30">
                      <button
                        onClick={() => {
                          setData({ ...data, selectedImage: "" });
                          setHoverImage(false);
                        }}
                        className="bg-primary-50 text-primary-900 px-4 py-3 rounded-md font-medium hover:bg-primary-900 hover:text-white transition-all"
                      >
                        Remove Image
                      </button>
                      {type === "detail" &&
                        dataBanner &&
                        dataBanner?.imageUrl !== data.selectedImage && (
                          <button
                            onClick={() => {
                              setData({
                                ...data,
                                selectedImage: dataBanner?.imageUrl,
                              });
                              setHoverImage(false);
                            }}
                            className="bg-primary-50 text-primary-900 px-4 py-3 rounded-md font-medium hover:bg-primary-900 hover:text-white transition-all"
                          >
                            Reset to Default
                          </button>
                        )}
                    </div>
                  )}
                  <img
                    src={data.selectedImage}
                    alt="Preview Image Banner Gasskeun Topup"
                    className="max-h-full max-w-full rounded-lg"
                  />
                </div>
              ) : (
                <div
                  onClick={handleClick}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`${
                    dragging ? "bg-gray-100" : "bg-white"
                  } w-full border-dashed h-52 border-2 border-primary-900 flex items-center justify-center rounded-md px-10 hover:cursor-pointer`}
                >
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept=".png, .jpg, .jpeg"
                    hidden
                    readOnly={typeForm === "detail"}
                    ref={inputFileRef}
                    onChange={handleFileInputChange}
                  />
                  <p className="text-primary-900 font-bold">
                    Drag and Drop Banner or click here to upload
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <div>
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Nama
                  {typeForm === "edit" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full">
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
                        ? "cursor-not-allowed text-neutral-700"
                        : "bg-primary-50 text-primary-900"
                    } py-3 px-2 w-full border mt-2 rounded-md border-primary-900 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Artikel URL
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="URL"
                    autoComplete="off"
                    value={data.eventUrl}
                    readOnly={typeForm === "detail"}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, eventUrl: e.target.value }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100"
                        : "bg-primary-50 text-primary-900"
                    } py-3 px-2 w-full border mt-2 rounded-md border-primary-900 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>
          {typeForm === "detail" && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setTypeForm("edit")}
                type="button"
                className="bg-primary-900 hover:bg-red-600 text-white font-semibold w-24 py-3 rounded-md"
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
                    disabled={disabledButton}
                    className={`${
                      disabledButton
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

export default FormAddBanner;
