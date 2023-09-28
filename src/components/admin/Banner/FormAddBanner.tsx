"use client";

import { carouselAdminState } from "@/atom/carouselAdminState";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragEvent, DragEventHandler, FormEvent, MouseEventHandler, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";

interface IFormAddBanner {
    handleShowForm: (value: boolean) => void;
    getBanners: () => void;
}

const FormAddBanner: React.FC<IFormAddBanner> = ({ handleShowForm, getBanners }) => {
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
    const [loading, setLoading] = useState(false);

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
        if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
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

    const postBanner = async () => {
        setLoading(true);
        const id = toast.loading("Sedang menyimpan data...");
        const formData = new FormData();
        formData.append("bannerImage", data.fileImage);
        formData.append("name", data.name);
        formData.append("eventUrl", data.eventUrl);

        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/banner", {
            method: "POST",
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
                render: "Berhasil Menambahkan Data Banner",
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
        postBanner();
    };

    return (
        <div
            onDrop={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat"
        >
            <div className="md:w-1/2 md:max-h-screen w-full bg-white shadow-lg p-4 rounded-lg">
                <div className="flex justify-between border-b-2 py-2 border-gray-600 items-center">
                    <h1 className="text-xl">Tambah Banner Baru</h1>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={() => handleShowForm(false)} />
                </div>
                <form onSubmit={handleAddBanner}>
                    <div className="flex flex-col gap-2 mt-3">
                        <label htmlFor="image">
                            Pilih Gambar <span className="text-red-800 font-bold">*</span>{" "}
                        </label>
                        {data.selectedImage ? (
                            <div
                                onMouseEnter={() => setHoverImage(true)}
                                onMouseLeave={() => setHoverImage(false)}
                                className="w-full h-36 flex items-center justify-center relative"
                            >
                                {hoverImage && (
                                    <div className="w-full h-full absolute bg-gray-800 bg-opacity-30 flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                setData({ ...data, selectedImage: "" });
                                                setHoverImage(false);
                                            }}
                                            className="bg-white px-4 py-3 rounded-md"
                                        >
                                            Remove This Image
                                        </button>
                                    </div>
                                )}
                                <img src={data.selectedImage} alt="Preview Image" className="max-h-full max-w-full" />
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
                                } w-full border-dashed h-36 border-2 border-gray-800 flex items-center justify-center rounded-md`}
                            >
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    ref={inputFileRef}
                                    onChange={handleFileInputChange}
                                />
                                <p className="text-gray-400 font-bold">Drag and Drop Banner or click here to upload</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <label htmlFor="name">
                            Nama <span className="text-red-800 font-bold">*</span>{" "}
                        </label>
                        <div className="w-full">
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
                        </div>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="name">Artikel Url</label>
                        <div className="w-full">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nama"
                                autoComplete="off"
                                value={data.eventUrl}
                                onChange={(e) => setData((prev) => ({ ...prev, eventUrl: e.target.value }))}
                                className="py-3 px-2 w-full border-2 mt-2 rounded-md border-gray-600 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
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
                                    className="bg-green-600 hover:bg-green-400 text-white font-semibold w-24 py-3 rounded-md"
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

export default FormAddBanner;
