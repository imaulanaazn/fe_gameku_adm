"use client";

import { userState } from "@/atom/userState";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const ChangeEmail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    oldEmail: "",
    newEmail: "",
  });

  const [user, setUser] = useRecoilState(userState);

  const handleSubmitChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Sedang Mengubah Email...");
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/update?type=email",
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
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      toast.update(toastId, {
        render: "Berhasil mengubah email",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    setData({
      oldEmail: "",
      newEmail: "",
    });
    setLoading(false);
  };
  return (
    <>
      <div className="w-full h-full md:h-max px-6 py-8 md:px-10 md:py-10 xl:px-16 xl:py-16 flex flex-col justify-center shadow-md rounded-xl bg-white">
        <h2 className="font-semibold text-2xl mb-8 xl:mb-10 text-center">
          Ganti Email
        </h2>
        <form
          onSubmit={handleSubmitChangeEmail}
          className="w-full text-xs text-black text-left"
        >
          <div className="mb-4">
            <label
              htmlFor="oldEmail"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              Email Lama
            </label>
            <input
              type="email"
              id="oldEmail"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.oldEmail}
              onChange={(e) =>
                setData((prev) => ({ ...prev, oldEmail: e.target.value }))
              }
              required
              placeholder="Email Lama"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="newEmail"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              Email Baru
            </label>
            <input
              type="email"
              id="newEmail"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.newEmail}
              onChange={(e) =>
                setData((prev) => ({ ...prev, newEmail: e.target.value }))
              }
              required
              placeholder="Email Baru"
            />
          </div>
          {loading ? (
            <div className="w-full py-3 bg-gray-300 text-black cursor-wait rounded-md text-center">
              <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!data.newEmail || !data.oldEmail}
              className={`${
                !data.newEmail || !data.oldEmail
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

export default ChangeEmail;
