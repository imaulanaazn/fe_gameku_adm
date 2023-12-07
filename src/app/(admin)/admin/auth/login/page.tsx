"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavigationOptions } from "swiper/types";

const Login = () => {
    const router = useRouter();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    // const [user, setUser] = useRecoilState(userState);

    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLoginAdmin = async (e: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const id = toast.loading("Proses Login...");
        const responseLogin = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/admin/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const res = await responseLogin.json();
        if (!responseLogin.ok) {
            setPassword("");
            toast.update(id, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            localStorage.setItem("user", JSON.stringify(res));
            toast.update(id, {
                render: "Berhasil Login",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            window.location.href = "/admin";
        }
        setLoading(false);
    };

    useEffect(() => {
        setAllowed(!(!username || !password));
    }, [username, password]);

    return (
        <div className="w-full h-screen flex justify-center items-center font-montserrat">
            <form className="w-1/2 bg-white p-4 rounded-md shadow border-2 border-gray-200" onSubmit={handleLoginAdmin}>
                <h1 className="text-center text-xl">Login Admin</h1>
                <div className="my-4">
                    <input
                        type="text"
                        id="username"
                        className="w-full p-4 border"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        placeholder="Masukkan username anda"
                        autoComplete="off"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        id="password"
                        className="w-full p-4 border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Masukkan Password"
                    />
                </div>
                {loading ? (
                    <div className="w-full py-4 bg-gray-400 text-black cursor-wait text-center">
                        <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                    </div>
                ) : (
                    <button
                        type="submit"
                        disabled={!allowed}
                        className={`w-full py-5 bg-[#B72025] ${
                            allowed
                                ? "bg-opacity-100 text-white hover:bg-[#c5474c] cursor-pointer"
                                : "bg-opacity-50 text-black cursor-not-allowed"
                        }`}
                    >
                        Masuk
                    </button>
                )}
            </form>
        </div>
    );
};

export default Login;
