"use client";

import { userState } from "@/atom/userState";
import Alert from "@/components/global/alert/Alert";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue, useRecoilState } from "recoil";

const FormLogin = () => {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
    otp: "",
  });
  const [user, setUser] = useRecoilState(userState);

  const [errorMessage, setErrorMessage] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [disableBtnReqOtp, setDisableBtnReqOtp] = useState(true);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (allowed) {
      const toastId = toast.loading("Memproses login...");
      const responseLogin = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        }
      );

      const res = await responseLogin.json();
      if (!responseLogin.ok) {
        toast.update(toastId, {
          render: res.message,
          type: "error",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
        setData((prev) => ({ ...prev, password: "" }));
      } else {
        router.push("/");
        localStorage.setItem("auth", JSON.stringify({ login: true }));
        localStorage.setItem("user", JSON.stringify(res));
        setUser(res);
        toast.update(toastId, {
          render: "Berhasil Login",
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
    const responseCustomer = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/me",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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
    queryParams.append("type", "login");
    queryParams.append(isEmail ? "email" : "mobileNumber", data.username);

    const toastId = toast.loading("Request Otp...");
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/otp?" + queryParams,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

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

    const waitingDate = dayjs(
      res?.waitingDate || dayjs().add(60, "second")
    ).diff(dayjs(), "second");
    setTimeRemaining(waitingDate);
  };

  const handleRequestOTP = () => {
    if (!data.username) {
      return toast.warn(
        "Silahkan isi terlebih dahulu nomor whatsapp atau email",
        {
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        }
      );
    }

    if (!isPhoneNumber && !isEmail) {
      return toast.error("Email atau nomor whatsapp tidak valid", {
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    requestOtp();
  };

  useEffect(() => {
    if (!data.username || !data.password || !data.otp) {
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [data.username, data.password, data.otp]);

  useEffect(() => {
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    setIsPhoneNumber(phoneRegex.test(data.username));
    setIsEmail(emailRegex.test(data.username));
    setDisableBtnReqOtp(
      !phoneRegex.test(data.username) && !emailRegex.test(data.username)
    );
  }, [data.username]);

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
    getMe();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md text-xs text-black"
    >
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <div className="mb-4">
        <input
          type="text"
          id="username"
          className="w-full p-4 border"
          value={data.username}
          onChange={(e) =>
            setData((prev) => ({ ...prev, username: e.target.value }))
          }
          required
          placeholder="Whatsapp / Email"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          id="password"
          className="w-full p-4 border"
          value={data.password}
          onChange={(e) =>
            setData((prev) => ({ ...prev, password: e.target.value }))
          }
          required
          placeholder="Password"
        />
      </div>
      <div className="mb-6 flex">
        <div className="w-full">
          <input
            type="text"
            id="otp"
            className="w-full p-4 border"
            value={data.otp}
            onChange={(e) =>
              setData((prev) => ({ ...prev, otp: e.target.value }))
            }
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
        <div className="bg-gray-400 text-black cursor-not-allowed w-full py-5">
          Masuk
        </div>
      )}
    </form>
  );
};

export default FormLogin;
