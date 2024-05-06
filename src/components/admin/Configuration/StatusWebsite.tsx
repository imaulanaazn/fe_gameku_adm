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
    {
      value: "online",
      label: "Online",
      bgActive: " bg-emerald-100 ",
      textActive: " text-emerald-800 ",
      bgIcon: " bg-emerald-600 ",
      borderActive: " border-emerald-700 ",
    },
    {
      value: "maintenance",
      label: "Maintenance",
      bgActive: "bg-yellow-100",
      textActive: "text-yellow-700",
      bgIcon: "bg-yellow-600",
      borderActive: "border-yellow-700",
    },
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
    <div className="mt-6">
      <h2 className="text-lg text-neutral-700 mb-4 font-medium">
        Status Website
      </h2>
      <div className="flex flex-col space-y-2">
        <div className="w-full flex gap-4 bg-white mt-1">
          {options.map((option) => (
            <div
              key={option.value}
              className={`py-2 px-4 cursor-pointer border rounded-full ${
                selectedOption === option.value
                  ? option.bgActive + option.textActive
                  : "bg-slate-200 text-slate-600 hover:bg-white hover:border-slate-400"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <span
                className={`h-3 w-3 rounded-full inline-block mr-2 ${
                  selectedOption === option.value
                    ? option.bgIcon
                    : "bg-slate-400"
                }`}
              />
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusWebsite;
