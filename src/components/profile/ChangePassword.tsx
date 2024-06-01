"use client";

import { userState } from "@/atom/userState";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [user, setUser] = useRecoilState(userState);
  const handleSubmitChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Sedang mengubah password...");
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/update?type=password",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          ...data,
          id: user.id,
        }),
      }
    );

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
      toast.update(toastId, {
        render: "Berhasil mengubah password",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    setData({
      oldPassword: "",
      newPassword: "",
    });
    setLoading(false);
  };
  return (
    <>
      <div className="w-full h-full md:h-max px-6 py-8 md:px-10 md:py-10 xl:px-16 xl:py-16 flex flex-col justify-center shadow-md rounded-xl bg-white">
        <h2 className="font-semibold text-2xl mb-8 xl:mb-10 text-center">
          Ganti Password
        </h2>
        <form
          onSubmit={handleSubmitChangeEmail}
          className="w-full text-xs text-black text-left"
        >
          <div className="mb-4">
            <label
              htmlFor="oldPassword"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              Password Lama
            </label>
            <input
              type="password"
              id="oldPassword"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.oldPassword}
              onChange={(e) =>
                setData((prev) => ({ ...prev, oldPassword: e.target.value }))
              }
              required
              placeholder="Password Lama"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.newPassword}
              onChange={(e) =>
                setData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              required
              placeholder="Password Baru"
            />
          </div>
          {loading ? (
            <div className="w-full py-3 bg-gray-300 text-black cursor-wait rounded-md text-center">
              <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!data.newPassword || !data.oldPassword}
              className={`${
                !data.newPassword || !data.oldPassword
                  ? "bg-primary-300 text-slate-100 cursor-not-allowed"
                  : "bg-primary-900 text-white hover:bg-black hover:text-white transition-all "
              } w-full text-center w-full py-3 px-4 rounded-md text-base font-semibold`}
            >
              Update
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
