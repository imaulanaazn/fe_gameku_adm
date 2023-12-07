"use client";

import { imageAtom } from "@/atom/logo";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

const ChangeLogoFooter = () => {
    const [logoFooter, setLogoFooter] = useState<{
        id: string;
        name: string;
        value: string;
        cd: string;
    } | null>(null);
    const [logoFooterState, setLogoFooterState] = useRecoilState(imageAtom);
    const [displayLogo, setDisplayLogo] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile) {
            const imgUrl = URL.createObjectURL(selectedFile);
            setDisplayLogo(imgUrl);
            setSelectedImage(selectedFile);
        }
    };

    const putLogo = async () => {
        const id = toast.loading("Sedang menyimpan data...");
        const formData = new FormData();
        selectedImage && formData.append("logo", selectedImage);

        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo_footer", {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            body: formData,
        });

        const res = await request.json();
        if (request.ok) {
            setLogoFooter((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        value: res.value,
                    };
                }

                return prev;
            });
            setLogoFooterState((prev) => ({
                ...prev,
                logo_footer: res[0].value,
            }));
            setSelectedImage(null);
            toast.update(id, {
                render: "Berhasil Mengubah Logo Footer",
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
    };

    const getLogo = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo_footer&detail=true", {
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            setLogoFooter(res[0]);
            setLogoFooterState((prev) => ({
                ...prev,
                logo_footer: res[0].value,
            }));
        }
    };

    const handleChangeImage = () => {
        putLogo();
    };

    useEffect(() => {
        if (!logoFooterState.logo_footer) {
            getLogo();
        }
    }, []);

    return (
        <div>
            <div className="w-[150px] aspect-square mt-3">
                <Image
                    src={displayLogo || logoFooter?.value || ""}
                    alt={`Logo Footer`}
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-lg object-contain"
                />
            </div>

            {!selectedImage && (
                <div>
                    <button
                        className="py-2 bg-white px-4 text-center border-2 shadow-md shadow-gray-400 w-[150px] mt-2 rounded-md hover:bg-gray-200"
                        onClick={handleFileUpload}
                    >
                        Ganti Logo Footer
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileSelected}
                    />
                </div>
            )}
            {selectedImage && (
                <div className="flex flex-col">
                    <button
                        className="py-2 bg-green-600 px-4 text-center border shadow-md w-[150px] mt-2 rounded-md hover:bg-green-400 text-white font-semibold"
                        onClick={handleChangeImage}
                    >
                        Save
                    </button>
                    <button
                        className="py-2 bg-red-600 px-4 text-center border shadow-md w-[150px] mt-2 rounded-md hover:bg-red-400 text-white font-semibold"
                        onClick={() => {
                            setSelectedImage(null);
                            setDisplayLogo(logoFooter?.value || "");
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChangeLogoFooter;
