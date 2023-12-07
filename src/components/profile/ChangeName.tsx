"use client";

import { userState } from "@/atom/userState";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { toast, useToast } from "react-toastify";
import { useRecoilState } from "recoil";

const ChangeName = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
    });
    const [user, setUser] = useRecoilState(userState);

    const handleSubmitChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastId = toast.loading("Sedang mengubah nama...");
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/update?type=name", {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                id: user.id,
                name: data.firstName + " " + data.lastName,
            }),
        });

        const res = await req.json();
        if (!req.ok) {
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            localStorage.setItem("user", JSON.stringify(res));
            setUser(res);
            toast.update(toastId, {
                render: "Berhasil mengubah nama",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }

        setData({
            firstName: "",
            lastName: "",
        });
        setLoading(false);
    };
    return (
        <>
            <div className="flex flex-col items-center gap-3 my-10">
                <h1 className="font-pulse font-semibold text-2xl">Ganti Nama</h1>
            </div>
            <form onSubmit={handleSubmitChangeEmail} className="w-full max-w-md text-xs text-black">
                <div className="mb-4">
                    <input
                        type="text"
                        id="firstName"
                        className="w-full p-4 border"
                        value={data.firstName}
                        onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))}
                        required
                        placeholder="Nama Depan"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        id="lastName"
                        className="w-full p-4 border"
                        value={data.lastName}
                        onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))}
                        required
                        placeholder="Nama Belakang"
                    />
                </div>
                {loading ? (
                    <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
                        <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                    </div>
                ) : (
                    <button
                        type="submit"
                        disabled={!data.lastName || !data.firstName}
                        className={`${
                            !data.lastName || !data.firstName
                                ? "bg-gray-400 text-black cursor-not-allowed"
                                : "bg-[#B72025] text-white hover:bg-[#c5474c] cursor-pointer"
                        } w-full py-5`}
                    >
                        Update
                    </button>
                )}
            </form>
        </>
    );
};

export default ChangeName;
