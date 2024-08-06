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
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/update?type=name",
      {
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
      <div className="w-full h-full md:h-max px-6 py-8 md:px-10 md:py-10 xl:px-8 xl:py-10 flex flex-col justify-center shadow-md rounded-xl bg-white">
        <h2 className="font-semibold text-2xl mb-8 xl:mb-10 text-center">
          Ganti Nama
        </h2>
        <form
          onSubmit={handleSubmitChangeEmail}
          className="w-full text-xs text-black text-left"
        >
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.firstName}
              onChange={(e) =>
                setData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              placeholder="Nama Depan"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="lastName"
              className="font-medium text-base text-neutral-900 inline-block mb-1.5"
            >
              First Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full py-3 px-4 bg-slate-100 rounded-md text-sm placeholder:text-sm overflow-hidden border border-solid border-white focus:bg-white focus:ring-0 focus:border-primary-900"
              value={data.lastName}
              onChange={(e) =>
                setData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
              placeholder="Nama Belakang"
            />
          </div>
          {loading ? (
            <div className="w-full py-3 bg-gray-300 text-black cursor-wait rounded-md text-center">
              <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!data.lastName || !data.firstName}
              className={`${
                !data.lastName || !data.firstName
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

export default ChangeName;
