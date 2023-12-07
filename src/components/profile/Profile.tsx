"use client";

import React, { useEffect, useRef, useState } from "react";
import ChangeEmail from "./ChangeEmail";
import ChangeName from "./ChangeName";
import ChangePassword from "./ChangePassword";
import HistoryTopup from "./HistoryTopup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userState";
import Loading from "@/app/(user)/loading";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const inputFile = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { push } = useRouter();
    const [user, setUser] = useRecoilState(userState);
    const [activeComponent, setActiveComponent] = useState("HistoryTopup");

    const renderComponent = () => {
        switch (activeComponent) {
            case "ChangeEmail":
                return <ChangeEmail />;
            case "ChangePassword":
                return <ChangePassword />;
            case "ChangeName":
                return <ChangeName />;
            case "HistoryTopup":
                return <HistoryTopup />;
            default:
                return null;
        }
    };

    const getUser = async () => {
        setLoading(true);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (!req.ok) {
            push("/login");
        } else {
            setUser(res);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        const toastId = toast.loading("Memproses logout...");
        setLoading(true);
        const responseCustomer = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/logout", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (responseCustomer.ok) {
            setUser({} as IUser);
            localStorage.setItem("auth", JSON.stringify({ login: false }));
            localStorage.removeItem("user");
            toast.update(toastId, {
                render: "Berhasil logout",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            push("/login");
        } else {
            const res = await responseCustomer.json();
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }
        setLoading(false);
    };

    const uploadImage = async (file: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/image?id=" + user.id, {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            body: formData,
        });

        const res = await req.json();
        if (req.ok) {
            setUser((prev) => ({
                ...prev,
                ...res,
            }));

            localStorage.setItem("user", JSON.stringify({ ...user, ...res }));
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleClick = () => {
        if (inputFile.current) {
            inputFile.current.click();
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    return (
        <>
            {loading && <Loading />}

            {user && !loading && (
                <div className="mx-auto pt-10 h-fit min-h-screen text-center w-full lg:p-5 font-pulse text-white flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-10 justify-between w-3/4 lg:flex-row flex-col">
                        <div className="flex gap-3 lg:flex-row flex-col justify-center items-center">
                            <div
                                style={{
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    ...(user.image && { backgroundImage: `url('${user.image}')` }),
                                    ...(!user.image && { backgroundColor: "white" }),
                                }}
                                className="h-20 aspect-square rounded-full bg-opacity-50 flex-shrink-0"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={handleClick}
                            >
                                {isHovered && (
                                    <>
                                        <div className="cursor-pointer bg-gray-800 bg-opacity-50 h-20 aspect-square rounded-full flex justify-center items-center">
                                            Edit
                                        </div>
                                        <input
                                            type="file"
                                            name="imageLogoDenom"
                                            id="imageLogoDenom"
                                            accept=".png, .jpg, .jpeg"
                                            hidden
                                            ref={inputFile}
                                            onChange={handleFileChange}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="lg:text-start">
                                <h2 className="text-sm">{user.name}</h2>
                                <p className="text-sm">{user.email}</p>
                            </div>
                        </div>
                        <div className="bg-[#B72025] px-4 py-2 rounded-sm cursor-pointer" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                    <div className="w-[90%] lg:w-full mb-10">
                        <ul className="mt-5 w-full bg-gray-400 flex justify-center lg:flex-row flex-col">
                            <li
                                className={`py-2 px-6 text-sm cursor-pointer ${
                                    activeComponent === "HistoryTopup" && "bg-[#B72025]"
                                }`}
                                onClick={() => setActiveComponent("HistoryTopup")}
                            >
                                History Top Up
                            </li>
                            <li
                                className={`py-2 px-6 text-sm cursor-pointer ${
                                    activeComponent === "ChangeName" && "bg-[#B72025]"
                                }`}
                                onClick={() => setActiveComponent("ChangeName")}
                            >
                                Ganti Nama
                            </li>
                            <li
                                className={`py-2 px-6 text-sm cursor-pointer ${
                                    activeComponent === "ChangeEmail" && "bg-[#B72025]"
                                }`}
                                onClick={() => setActiveComponent("ChangeEmail")}
                            >
                                Ganti Email
                            </li>
                            <li
                                className={`py-2 px-6 text-sm cursor-pointer ${
                                    activeComponent === "ChangePassword" && "bg-[#B72025]"
                                }`}
                                onClick={() => setActiveComponent("ChangePassword")}
                            >
                                Atur Ulang Password
                            </li>
                        </ul>
                    </div>
                    {renderComponent()}
                </div>
            )}
        </>
    );
};

export default Profile;
