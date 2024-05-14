"use client";

import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IConfig {
  api: string;
  webhook: string;
}

const defaultValue = "***********************************";

const Xendit = () => {
  const [isDisabled, setIsDisabled] = useState({
    api: true,
    webhook: true,
  });
  const [value, setValue] = useState<any>({
    api: defaultValue,
    webhook: defaultValue,
  });
  const [showButton, setShowButton] = useState(false);
  const [data, setData] = useState<{ cd: string; value: string }[]>([]);

  const handleClickEdit = (e: "api" | "webhook") => {
    setIsDisabled((prev) => ({
      ...prev,
      [e]: !isDisabled[e],
    }));
  };

  const putXenditConfig = async () => {
    const toastId = toast.loading("Sedang Mengubah Konfigurasi Xendit...");
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/xendit", {
      cache: "no-cache",
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(data),
    });

    if (req.ok) {
      toast.update(toastId, {
        render: "Berhasil mengubah konfigurasi xendit",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render:
          res.message ||
          "Ada kesalahan ketika menyimpan data baru, silahkan coba lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    setValue({
      api: defaultValue,
      webhook: defaultValue,
    });
    setIsDisabled({
      api: true,
      webhook: true,
    });
  };

  const handleSaveConfig = () => {
    if (data.length === 0) {
      return;
    }

    let isTrue = false;
    for (const d of data) {
      if (!d.value) {
        isTrue = false;
      } else {
        isTrue = true;
      }
    }

    if (isTrue) {
      putXenditConfig();
    } else {
      toast.error("Silahkan isi terlebih dahulu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const data = [];
    for (const key in value) {
      if (value[key] !== defaultValue) {
        data.push({
          cd: key + "_key",
          value: value[key],
        });
      }
    }
    setData(data);
  }, [value.api, value.webhook]);

  useEffect(() => {
    setShowButton(!isDisabled.api || !isDisabled.webhook);
    setValue({
      api: isDisabled.api
        ? defaultValue
        : value.api === defaultValue
        ? ""
        : value.api,
      webhook: isDisabled.webhook
        ? defaultValue
        : value.webhook === defaultValue
        ? ""
        : value.webhook,
    });
  }, [isDisabled.api, isDisabled.webhook]);

  return (
    <>
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              API Secret Key
            </th>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              <input
                type="text"
                value={value["api"]}
                disabled={isDisabled["api"]}
                onChange={(e) =>
                  setValue((prev: any) => ({
                    ...prev,
                    api: e.target.value,
                  }))
                }
                className={`border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500 ${
                  !isDisabled["api"]
                    ? "border-primary-900"
                    : "border-transparent"
                }`}
              />
            </th>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              <div
                className="font-bold text-blue-800 cursor-pointer select-none w-max ml-4"
                onClick={() => handleClickEdit("api")}
              >
                <p>Edit</p>
              </div>
            </th>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              Webhook Verification Key
            </th>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              <input
                type="text"
                value={value["webhook"]}
                disabled={isDisabled["webhook"]}
                onChange={(e) =>
                  setValue((prev: any) => ({
                    ...prev,
                    webhook: e.target.value,
                  }))
                }
                className={`border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500 ${
                  !isDisabled["webhook"]
                    ? "border-primary-900"
                    : "border-transparent"
                }`}
              />
            </th>
            <th
              scope="row"
              className="py-2 font-medium text-gray-900 whitespace-nowrap text-start"
            >
              <div
                className="font-montserrat font-bold text-blue-800 cursor-pointer select-none w-max ml-4"
                onClick={() => handleClickEdit("webhook")}
              >
                <p>Edit</p>
              </div>
            </th>
          </tr>
        </tbody>
      </table>
      {showButton && (
        <div className="w-full flex justify-end gap-2 mt-4">
          <button
            className="py-2 bg-emerald-500 text-white px-4 text-center border rounded-md hover:bg-emerald-600 text-white font-medium"
            onClick={handleSaveConfig}
          >
            Save
          </button>
          <button
            onClick={() =>
              setIsDisabled({
                api: true,
                webhook: true,
              })
            }
            className="py-2 bg-primary-600 px-4 text-center border rounded-md hover:bg-primary-900 text-white font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

export default Xendit;
