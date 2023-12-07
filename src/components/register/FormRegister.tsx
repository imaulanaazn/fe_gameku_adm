"use client";

import Alert from "@/components/global/alert/Alert";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userState";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const FormRegister = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [otp, setOtp] = useState("");
    const [disableBtnReqOtp, setDisableBtnReqOtp] = useState(true);
    const [user, setUser] = useRecoilState(userState);

    const [allowed, setAllowed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [differentPassword, setDifferentPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (allowed) {
            const toastId = toast.loading("Memproses pendaftaran...");
            setLoading(true);
            const registration = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/v1/customer/registration`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    email,
                    name,
                    mobileNumber,
                    password,
                    otp,
                }),
            });

            const res = await registration.json();
            if (!registration.ok) {
                toast.update(toastId, {
                    render: res.message,
                    type: "error",
                    isLoading: false,
                    position: "top-right",
                    autoClose: 3000,
                });
                setConfirmPassword("");
                setPassword("");
            } else {
                router.push("/");
                localStorage.setItem("auth", JSON.stringify({ login: true }));
                localStorage.setItem("user", JSON.stringify(res));
                setUser(res);

                toast.update(toastId, {
                    render: "Berhasil melakukan pendaftaran",
                    type: "success",
                    isLoading: false,
                    position: "top-right",
                    autoClose: 3000,
                });
            }
            setLoading(false);
        }
    };

    const getMe = async () => {
        const responseCustomer = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer", {
            method: "GET",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
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

    const requestOtp = async () => {
        const queryParams = new URLSearchParams();
        queryParams.append("type", "register");
        queryParams.append("mobileNumber", mobileNumber);

        const toastId = toast.loading("Request Otp...");
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/otp?" + queryParams, {
            method: "GET",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        const res = await req.json();
        if (req.ok) {
            toast.update(toastId, {
                render: "Berhasil Request Otp",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }

        const waitingDate = dayjs(res?.waitingDate || dayjs().add(60, "second")).diff(dayjs(), "second");
        setTimeRemaining(waitingDate);
    };

    const handleRequestOTP = () => {
        if (!mobileNumber) {
            return toast.warn("Silahkan isi terlebih dahulu nomor whatsapp", {
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }

        requestOtp();
    };
    useEffect(() => {
        const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;

        setDisableBtnReqOtp(!phoneRegex.test(mobileNumber));
    }, [mobileNumber]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (timeRemaining && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => (prevTime ? prevTime - 1 : null));
            }, 1000);
        }

        return () => {
            if (interval !== undefined) {
                clearInterval(interval);
            }
        };
    }, [timeRemaining]);

    useEffect(() => {
        if (email && name && mobileNumber && password && confirmPassword && password === confirmPassword && otp) {
            setAllowed(true);
        } else {
            setAllowed(false);
        }
    }, [email, name, mobileNumber, password, confirmPassword, otp]);

    useEffect(() => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                setDifferentPassword(true);
            } else {
                setDifferentPassword(false);
            }
        }
    }, [password, confirmPassword]);

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
                    type="email"
                    id="email"
                    className="w-full p-4 border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    id="name"
                    className="w-full p-4 border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nama"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    id="mobileNumber"
                    className="w-full p-4 border"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    placeholder="No Whatsapp"
                />
            </div>
            <div className="mb-4">
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
            <div className="mb-4">
                <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-4 border"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Konfirmasi Password"
                />
            </div>
            <div className={`${differentPassword ? "mb-4" : "mb-6"} flex`}>
                <div className="w-full">
                    <input
                        type="text"
                        id="otp"
                        className="w-full p-4 border"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="Kode OTP"
                    />
                </div>
                <div className="w-40">
                    {timeRemaining && timeRemaining > 0 ? (
                        <div className="w-full h-full bg-gray-400 text-black flex items-center justify-center cursor-not-allowed">
                            {timeRemaining}
                        </div>
                    ) : (
                        <button
                            type="button"
                            disabled={disableBtnReqOtp}
                            onClick={() => handleRequestOTP()}
                            className={`w-full h-full ${
                                disableBtnReqOtp
                                    ? "bg-gray-400 text-black cursor-not-allowed"
                                    : "text-white bg-[#B72025] cursor-pointer"
                            }`}
                        >
                            Request OTP
                        </button>
                    )}
                </div>
            </div>
            {differentPassword && (
                <p className="text-white text-start mb-2">* Password dan Konfirmasi Password tidak cocok</p>
            )}
            {loading ? (
                <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
                    <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
                </div>
            ) : allowed ? (
                <button
                    type="submit"
                    className={`w-full py-5 bg-[#B72025] text-white hover:bg-[#c5474c] cursor-pointer`}
                >
                    Daftar
                </button>
            ) : (
                <div className="bg-gray-400 text-black cursor-not-allowed w-full py-5">Daftar</div>
            )}
        </form>
    );
};

export default FormRegister;
