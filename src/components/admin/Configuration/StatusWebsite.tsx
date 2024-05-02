"use client";

import { useEffect, useState } from "react";
import { faCaretDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

const StatusWebsite = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const options = [
    { value: "online", label: "Online", color: "green" },
    { value: "maintenance", label: "Maintenance", color: "yellow" },
    // { value: "offline", label: "Offline", color: "bg-red-600" },
  ];

  const handleOptionClick = (value: string) => {
    putWebsiteStatus(value);
    setIsOptionsVisible(false);
  };

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const putWebsiteStatus = async (value: string) => {
    setLoading(true);
    const toastId = toast.loading("Mengubah status website...");
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/config?type=website_status&value=" +
        value,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (req.ok) {
      toast.update(toastId, {
        render: "Berhasil mengubah status website",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
      setSelectedOption(
        options.find((item) => item.value === value)?.value || "online"
      );
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render:
          res.message || "Gagal mengubah status website silahkan coba lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  const getWebsiteStatus = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/config?type=website_status&detail=true",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      setSelectedOption(
        options.find((item) => item.value === res[0].value)?.value || "online"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getWebsiteStatus();
  }, []);
  return (
    <div className="mt-2">
      <p>Status Website</p>
      <div className="flex flex-col space-y-2">
        <div
          id="selectOption"
          className="p-2 border border-gray-300 rounded cursor-pointer relative"
          onClick={toggleOptions}
        >
          <div className="w-full flex gap-4 bg-white mt-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`py-2 px-4 cursor-pointer border-slate-400 rounded-full text-${
                  option.color
                }-600 ${
                  selectedOption === option.value
                    ? "bg-" + option.color + "-100"
                    : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <span
                  className={`h-3 w-3 rounded-full inline-block mr-2 bg-${option.color}-600`}
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusWebsite;
