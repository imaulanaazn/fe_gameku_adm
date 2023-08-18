"use client";

import { userState } from "@/atom/userState";
import Alert from "@/components/global/alert/Alert";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

const FormLogin = () => {
    const router = useRouter();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useRecoilState(userState);

    const [errorMessage, setErrorMessage] = useState("");
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (allowed) {
            const responseLogin = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/customer/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const res = await responseLogin.json();
            if (!responseLogin.ok) {
                setErrorMessage(res.message);
                setPassword("");
            } else {
                router.push("/");
                localStorage.setItem("auth", JSON.stringify({ login: true }));
                localStorage.setItem("user", JSON.stringify(res));
                setUser(res);
            }
            setLoading(false);
        }
    };

    const getMe = async () => {
        const responseCustomer = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/customer", {
            method: "GET",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
        });

        const res = await responseCustomer.json();
        if (responseCustomer.ok) {
            localStorage.setItem("auth", JSON.stringify({ login: true }));
            localStorage.setItem("user", JSON.stringify(res));
            setUser(res);

            return true;
        } else {
            localStorage.setItem("auth", JSON.stringify({ login: false }));
            return false;
        }
    };

    useEffect(() => {
        if (!username || !password) {
            setAllowed(false);
        } else {
            setAllowed(true);
        }
    }, [username, password]);

    useEffect(() => {
        const isLoggedLocalStorage = localStorage.getItem("auth");
        const userLocalStorage = localStorage.getItem("user");

        if (isLoggedLocalStorage) {
            const { login } = JSON.parse(isLoggedLocalStorage);

            if (login) {
                if (userLocalStorage) {
                    setUser(JSON.parse(userLocalStorage));
                    router.push("/");
                } else {
                    const checkUser = async () => {
                        const hasLogged = await getMe();
                        if (hasLogged) {
                            router.push("/");
                        }
                    };
                    checkUser();
                }
            } else {
                setUser({} as IUser);
            }
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md text-xs text-black">
            {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage("")} />}
            <div className="mb-4">
                <input
                    type="text"
                    id="username"
                    className="w-full p-4 border"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Whatsapp / Email"
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
                    placeholder="Password"
                />
            </div>
            {loading ? (
                <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
                    <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                </div>
            ) : allowed ? (
                <button
                    type="submit"
                    className={`w-full py-5 bg-[#B72025] text-white hover:bg-[#c5474c] cursor-pointer`}
                >
                    Masuk
                </button>
            ) : (
                <div className="bg-gray-400 text-black cursor-not-allowed w-full py-5">Masuk</div>
            )}
        </form>
    );
};

export default FormLogin;
