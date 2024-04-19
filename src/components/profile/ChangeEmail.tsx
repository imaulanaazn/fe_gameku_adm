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
      <div className="flex flex-col items-center gap-3 my-10">
        <h1 className=" font-semibold text-2xl">Ganti Email</h1>
      </div>
      <form
        onSubmit={handleSubmitChangeEmail}
        className="w-full max-w-md text-xs text-black"
      >
        <div className="mb-4">
          <input
            type="email"
            id="oldEmail"
            className="w-full p-4 border"
            value={data.oldEmail}
            onChange={(e) =>
              setData((prev) => ({ ...prev, oldEmail: e.target.value }))
            }
            required
            placeholder="Email Lama"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="newEmail"
            className="w-full p-4 border"
            value={data.newEmail}
            onChange={(e) =>
              setData((prev) => ({ ...prev, newEmail: e.target.value }))
            }
            required
            placeholder="Email Baru"
          />
        </div>
        {loading ? (
          <div className="w-full py-5 bg-gray-400 text-black cursor-wait">
            <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
          </div>
        ) : (
          <button
            type="submit"
            disabled={!data.newEmail || !data.oldEmail}
            className={`${
              !data.newEmail || !data.oldEmail
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

export default ChangeEmail;
