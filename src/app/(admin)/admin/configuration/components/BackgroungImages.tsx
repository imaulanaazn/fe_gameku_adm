"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FontAwesome } from "mdi-material-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const BackgroungImages = () => {
  const [activeBackgroundImage, setActiveBackgroundImage] = useState<{
    id: string;
    name: string;
    value: string;
    cd: string;
  } | null>(null);

  const [hoverBackground, setHoverBackground] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [displayImage, setDisplayImage] = useState("");
  const [bgImage, setBgImage] = useState<
    {
      id: string;
      name: string;
      value: string;
      cd: string;
    }[]
  >([]);

  const putLogo = async () => {
    if (activeBackgroundImage) {
      const id = toast.loading("Sedang menyimpan data...");
      const formData = new FormData();
      selectedImage && formData.append("logo", selectedImage);

      const request = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/v1/config?type=" +
          activeBackgroundImage.cd,
        {
          cache: "no-cache",
          method: "PUT",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          body: formData,
        }
      );

      const res = await request.json();
      if (request.ok) {
        setBgImage((prev) => {
          const data = prev.find(
            (item) => item.id === activeBackgroundImage.id
          );
          if (data) {
            data.value = res.value;
          }

          return prev;
        });
        setSelectedImage(null);
        toast.update(id, {
          render: "Berhasil Mengubah Background Image",
          type: "success",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.update(id, {
          render: res.message || "Terjadi kesalahan, silahkan coba lagi",
          type: "error",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleFileUpload = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }

    setHoverBackground(true);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
    }
  };

  const getBgImage = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/config?type=bg_login,bg_register,bg_checkorder,bg_profile&detail=true",
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
      setActiveBackgroundImage(res[0]);
      setBgImage(res);
    }
  };

  const handleUpload = async () => {
    putLogo();
  };

  useEffect(() => {
    getBgImage();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const imgUrl = URL.createObjectURL(selectedImage);
      setDisplayImage(imgUrl);
    } else {
      setDisplayImage(activeBackgroundImage?.value || "");
    }
  }, [selectedImage, activeBackgroundImage?.value]);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between flex-wrap items-end mb-4 mt-6 gap-2 lg:mt-0">
        <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
          Background Image
        </h1>
        <div className="flex items-center justify-center w-max">
          <div
            className="relative inline-block text-left w-max"
            ref={dropDownRef}
          >
            <button
              id="dropdown-button"
              onClick={() => {
                setIsDropDownOpen((prev) => !prev);
              }}
              className="flex gap-2 w-full items-center px-4 py-2 text-sm text-neutral-600 border border-primary-900 rounded-md focus:bg-primary-50 text-primary-900"
            >
              {activeBackgroundImage?.name}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-sm transition-all ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}
            >
              <div className="py-2 p-2" role="menu">
                {bgImage.length > 0 &&
                  bgImage.map((data: any) => (
                    <button
                      onClick={() => {
                        setActiveBackgroundImage(data);
                        setDisplayImage("");
                        setSelectedImage(null);
                        setIsDropDownOpen((prev) => !prev);
                      }}
                      key={data.id}
                      className="w-full text-left rounded-md px-4 py-2 text-sm hover:bg-gray-100 active:bg-primary-100 cursor-pointer text-slate-600"
                      role="menuitem"
                    >
                      {data.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full flex aspect-video items-center relative group">
          <div
            className={`w-full h-full absolute scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-gray-400 bg-opacity-30 flex items-center justify-center transition-all`}
          >
            <button
              onClick={handleFileUpload}
              className="bg-white px-4 py-3 rounded-md"
            >
              Ganti Background
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputFileRef}
              onChange={handleFileSelected}
            />
          </div>
          <Image
            src={displayImage}
            alt={`Background Image`}
            width="0"
            height="0"
            sizes="100vw"
            className="rounded-lg overflow-hidden object-cover w-full h-full"
          />
        </div>

        {selectedImage && (
          <div className="w-full flex gap-2 mt-2">
            <button
              className="py-2 flex-1 bg-primary-900 text-white px-4 text-center border rounded-md hover:bg-red-600 text-white font-medium"
              onClick={handleUpload}
            >
              Save
            </button>
            <button
              className="py-2 flex-1 hover:bg-primary-100 px-4 text-center border rounded-md border-primary-900 text-primary-900 font-medium"
              onClick={() => {
                setSelectedImage(null);
                setDisplayImage("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BackgroungImages;
