"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const BackgroungImages = () => {
    const [activeBackgroundImage, setActiveBackgroundImage] = useState<{
        id: string;
        name: string;
        value: string;
        cd: string;
    } | null>(null);

    const [hoverBackground, setHoverBackground] = useState(false);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [displayImage, setDisplayImage] = useState("");
    const [bgImage, setBgImage] = useState<
        {
            id: string;
            name: string;
            value: string;
            cd: string;
        }[]
    >([]);

    const putLogo = async () => {
        if (activeBackgroundImage) {
            const id = toast.loading("Sedang menyimpan data...");
            const formData = new FormData();
            selectedImage && formData.append("logo", selectedImage);

            const request = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=" + activeBackgroundImage.cd,
                {
                    cache: "no-cache",
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: formData,
                },
            );

            const res = await request.json();
            if (request.ok) {
                setBgImage((prev) => {
                    const data = prev.find((item) => item.id === activeBackgroundImage.id);
                    if (data) {
                        data.value = res.value;
                    }

                    return prev;
                });
                setSelectedImage(null);
                toast.update(id, {
                    render: "Berhasil Mengubah Background Image",
                    type: "success",
                    isLoading: false,
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.update(id, {
                    render: res.message || "Terjadi kesalahan, silahkan coba lagi",
                    type: "error",
                    isLoading: false,
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    };

    const handleFileUpload = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }

        setHoverBackground(true);
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile) {
            setSelectedImage(selectedFile);
        }
    };

    const getBgImage = async () => {
        const req = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/v1/config?type=bg_login,bg_register,bg_checkorder,bg_profile&detail=true",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            },
        );

        const res = await req.json();
        if (req.ok) {
            setActiveBackgroundImage(res[0]);
            setBgImage(res);
        }
    };

    const handleUpload = async () => {
        putLogo();
    };

    useEffect(() => {
        getBgImage();
    }, []);

    useEffect(() => {
        if (selectedImage) {
            const imgUrl = URL.createObjectURL(selectedImage);
            setDisplayImage(imgUrl);
        } else {
            setDisplayImage(activeBackgroundImage?.value || "");
        }
    }, [selectedImage, activeBackgroundImage?.value]);

    return (
        <>
            <div>
                <p>Background Image</p>
                <div className="flex flex-col gap-2">
                    {bgImage.length > 0 &&
                        bgImage.map((data) => (
                            <button
                                key={data.id}
                                onClick={() => {
                                    setActiveBackgroundImage(data);
                                    setDisplayImage("");
                                    setSelectedImage(null);
                                }}
                                className={`py-2 ${
                                    activeBackgroundImage && data.id === activeBackgroundImage.id
                                        ? "bg-blue-600 hover:bg-blue-400 text-white shadow-white"
                                        : "bg-white hover:bg-gray-200 shadow-gray-400"
                                } px-4 text-center border-2 shadow-md w-[150px] mt-2 rounded-md`}
                            >
                                {data.name}
                            </button>
                        ))}
                </div>
            </div>
            <div>
                <div
                    className="h-52 flex items-center relative"
                    onMouseEnter={() => setHoverBackground(true)}
                    onMouseLeave={() => setHoverBackground(false)}
                >
                    <div
                        className={`w-full h-full absolute bg-gray-800 bg-opacity-30 flex items-center justify-center ${
                            !hoverBackground && "hidden"
                        }`}
                    >
                        <button onClick={handleFileUpload} className="bg-white px-4 py-3 rounded-md">
                            Ganti Background
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={inputFileRef}
                            onChange={handleFileSelected}
                        />
                    </div>
                    <Image
                        src={displayImage}
                        alt={`Background Image`}
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-lg object-cover"
                    />
                </div>

                {selectedImage && (
                    <div className="w-full flex space-x-2">
                        <button
                            className="py-2 bg-green-600 px-4 text-center border shadow-md w-1/2 mt-2 rounded-md hover:bg-green-400 text-white font-semibold"
                            onClick={handleUpload}
                        >
                            Save
                        </button>
                        <button
                            className="py-2 bg-red-600 px-4 text-center border shadow-md w-1/2 mt-2 rounded-md hover:bg-red-400 text-white font-semibold"
                            onClick={() => {
                                setSelectedImage(null);
                                setDisplayImage("");
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default BackgroungImages;
