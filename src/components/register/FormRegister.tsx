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
      const registration = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/v1/customer/registration`,
        {
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
        }
      );

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
    const responseCustomer = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer",
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
    queryParams.append("type", "register");
    queryParams.append("mobileNumber", mobileNumber);

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
    if (
      email &&
      name &&
      mobileNumber &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      otp
    ) {
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md text-xs text-black text-left"
    >
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nama"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="mobileNumber"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="mobileNumber"
          className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          placeholder="No Whatsapp"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          Konfirmasi Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Konfirmasi Password"
        />
      </div>
      <div>
        <label
          htmlFor="otp"
          className="font-medium text-base text-neutral-900 inline-block mb-1.5"
        >
          OTP
        </label>
        <div
          className={`${
            differentPassword ? "mb-4" : "mb-6"
          } flex justify-between gap-4`}
        >
          <div className="w-full">
            <input
              type="text"
              id="otp"
              className="w-full py-3 px-4 bg-slate-200 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Kode OTP"
            />
          </div>
          <div>
            {timeRemaining && timeRemaining > 0 ? (
              <div className="h-full w-12 text-black flex items-center justify-center cursor-not-allowed rounded-md bg-slate-200">
                {timeRemaining}
              </div>
            ) : (
              <button
                type="button"
                disabled={disableBtnReqOtp}
                onClick={() => handleRequestOTP()}
                className={`shrink-0 h-full w-max ${
                  disableBtnReqOtp
                    ? "bg-primary-300 text-white cursor-not-allowed px-4 border-0 rounded-md text-sm"
                    : "bg-primary-900 cursor-pointer py-3 px-4 border-0 rounded-md text-sm hover:bg-black transition-all text-white"
                }`}
              >
                Request OTP
              </button>
            )}
          </div>
        </div>
      </div>
      {differentPassword && (
        <p className="text-white text-start mb-2">
          * Password dan Konfirmasi Password tidak cocok
        </p>
      )}
      {loading ? (
        <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
          <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
        </div>
      ) : allowed ? (
        <button
          type="submit"
          className={`text-center bg-primary-900 text-white w-full py-3 px-4 rounded-md text-base font-semibold hover:bg-black hover:text-white transition-all`}
        >
          Daftar
        </button>
      ) : (
        <div className="text-center bg-primary-300 text-slate-100 cursor-not-allowed w-full py-3 px-4 rounded-md text-base font-semibold">
          Daftar
        </div>
      )}
    </form>
  );
};

export default FormRegister;
