"use client";

import Loading from "@/components/global/loading/CompLoading";
import { ROLES } from "@/enum";
import {
  faArrowLeft,
  faChevronDown,
  faGear,
  faMountainSun,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Editor from "./components/Editor";

const initialConent = {
  title: "title",
  image: "",
  content: "<p>content</p>",
};

const dummyCategories = [
  { id: "1", name: "Games" },
  { id: "2", name: "Valorant" },
  { id: "3", name: "AOT" },
];

const initialContentSetting = {
  permalink: "perma",
  categories: [{ id: "1", name: "ada" }],
  actionBtn: {
    name: "button",
    destination: "gasskeunt",
  },
};

export default function Page() {
  const [isAuthorized, seIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(initialConent);
  const [contentSettings, setContentSettings] = useState(initialContentSetting);
  const [checked, setChecked] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [categories, setCategories] = useState(dummyCategories);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
    }
  };

  useEffect(() => {
    const result = localStorage.getItem("admin");
    const user = result ? JSON.parse(result) : null;

    const isAuthorized = (() => {
      switch (user?.roleName) {
        case ROLES.ADMINMANAGER:
        case ROLES.WRITER:
          return true;
        default:
          return false;
      }
    })();
    seIsAuthorized(isAuthorized);
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        console.log("fetch some data");
        setIsLoading(false);
      } catch (error) {
        console.error("error fetching data");
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const imgUrl = URL.createObjectURL(selectedImage);
      setContent((prev) => ({ ...prev, image: imgUrl }));
    } else {
      setContent((prev) => ({ ...prev, image: "" }));
    }
  }, [selectedImage]);

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    console.log({ contentSettings, content });
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Blog uploaded successfully:", data.imageUrl);
      } else {
        console.error("Blog upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading blog:", error);
    }
  };

  const handleCategory = (category: { id: string; name: string }) => {
    setContentSettings((prev) => {
      const isSelected = prev.categories.some((cat) => cat.id === category.id);
      const newCategories = isSelected
        ? prev.categories.filter((cat) => cat.id !== category.id)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  const isCategorySelected = (categoryId: string) => {
    return contentSettings.categories.some((cat) => cat.id === categoryId);
  };

  // if (!isAuthorized && !isLoading)
  //   return <div>you dont have permission to access this page</div>;

  isLoading && <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 w-full flex relative">
      {/* BLOG EDITOR */}
      <main className="w-full lg:w-9/12 xl mx-auto py-6 px-6">
        <form className="bg-white p-4 md:p-8 shadow-md rounded-lg flex flex-col gap-4">
          <button
            type="button"
            className="self-end lg:hidden"
            onClick={() => {
              setShowOptions((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faGear} className="text-xl text-gray-600" />
          </button>
          <div>
            <input
              type="text"
              id="title"
              name="title"
              value={content.title}
              className="w-full px-0 py-2 palceholder:text-gray-100 font-bold text-4xl placeholder:text-4xl border-0"
              placeholder="|Tambah Judul"
              onChange={(e) => {
                setContent((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
          </div>
          <div className="w-full h-auto aspect-video bg-slate-100 flex items-center justify-center relative hover:brightness-90">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="h-full w-full opacity-0 absolute top-0 left-0 hover:cursor-pointer z-50"
            />
            <FontAwesomeIcon
              icon={faMountainSun}
              className="text-4xl text-gray-400 "
            />
            {content.image && (
              <Image
                src={content.image}
                fill={true}
                alt="blog-banner"
                objectFit="cover"
              />
            )}
          </div>
          <div>
            <Editor
              setValue={(val: string) => {
                setContent((prev) => ({ ...prev, content: val }));
              }}
              value={content.content}
            />
          </div>
        </form>
      </main>

      {/* OPTIONS ASIDE */}
      <div
        className={`options w-3/4 md:w-2/5 lg:w-3/12 px-4 py-8 md:py-6 bg-white h-[91vh] fixed lg:sticky top-16 right-0 transition-all duration-400 ${
          showOptions ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-base">Setelan Postingan</p>
          <button
            className="lg:hidden"
            onClick={() => {
              setShowOptions((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl text-gray-600" />
          </button>
        </div>
        <div className="w-full text-xs sm:text-sm flex items-center gap-x-3 flex-wrap select-none">
          <input
            type="checkbox"
            id="options1"
            checked={"options1" === checked}
            className="peer appearance-none opacity-0 w-0 h-0"
            onChange={() => {
              setChecked((prev) => (prev === "options1" ? "" : "options1"));
            }}
          />
          <label
            htmlFor="options1"
            className="py-4 cursor-pointer grow flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${
                "options1" === checked ? "rotate-180" : "rotate-0"
              } text-gray-500 transition-all text-base`}
            />
            <p className="text-gray-500 text-base">Permalink</p>
          </label>
          <div className="peer-checked:max-h-max max-h-0 basis-full border-b peer-checked:py-3 overflow-hidden transition-all select-text">
            <p className="text-gray-500">
              https://gasskeuntopup.com/{contentSettings.permalink}
            </p>
            <input
              type="text"
              value={contentSettings.permalink}
              onChange={(e) =>
                setContentSettings((prev) => ({
                  ...prev,
                  permalink: e.target.value,
                }))
              }
              className="w-full p-2 mt-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
              placeholder="Custom permalink"
            />
          </div>
        </div>

        <div className=" w-full  text-xs sm:text-sm flex items-center gap-x-3 flex-wrap select-none">
          <input
            type="checkbox"
            id="options2"
            checked={"options2" === checked}
            className="peer appearance-none opacity-0 w-0 h-0"
            onChange={() => {
              setChecked((prev) => (prev === "options2" ? "" : "options2"));
            }}
          />
          <label
            htmlFor="options2"
            className="py-4 cursor-pointer grow flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${
                "options2" === checked ? "rotate-180" : "rotate-0"
              } text-gray-500 transition-all text-base`}
            />
            <p className="text-gray-500 text-base">Kategori</p>
          </label>
          <div className="w-full peer-checked:max-h-max max-h-0 basis-full border-b peer-checked:py-3 overflow-hidden transition-all select-text flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${
                  isCategorySelected(category.id)
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                } w-max py-2 px-4 rounded-full hover:cursor-pointer`}
                onClick={() => handleCategory(category)}
              >
                <p className="text-sm">{category.name}</p>
              </div>
            ))}
            <input
              type="text"
              onChange={() => {}}
              className="w-full p-2 mt-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
              placeholder="Add New Category"
            />
          </div>
        </div>

        <div className=" w-full text-xs sm:text-sm flex items-center gap-x-3 flex-wrap select-none">
          <input
            type="checkbox"
            id="options3"
            checked={"options3" === checked}
            className="peer appearance-none opacity-0 w-0 h-0"
            onChange={() => {
              setChecked((prev) => (prev === "options3" ? "" : "options3"));
            }}
          />
          <label
            htmlFor="options3"
            className="py-4 cursor-pointer grow flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${
                "options3" === checked ? "rotate-180" : "rotate-0"
              } text-gray-500 transition-all text-base`}
            />
            <p className="text-gray-500 text-base">Action Button</p>
          </label>
          <div className="peer-checked:max-h-max max-h-0 basis-full border-0 peer-checked:py-3 overflow-hidden transition-all select-text">
            <input
              type="text"
              className="w-full p-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
              placeholder="nama button"
              value={contentSettings.actionBtn.name}
              onChange={(e) =>
                setContentSettings((prev) => ({
                  ...prev,
                  actionBtn: { ...prev.actionBtn, name: e.target.value },
                }))
              }
            />
            <input
              type="text"
              className="w-full p-2 rounded-md border-slate-300 focus:border-slate-500 text-sm mt-3"
              placeholder="destinasi"
              value={contentSettings.actionBtn.destination}
              onChange={(e) =>
                setContentSettings((prev) => ({
                  ...prev,
                  actionBtn: { ...prev.actionBtn, destination: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="buttons flex lg:flex-col xl:flex-row gap-4 lg:gap-3 xl:gap-4 justify-center mt-4">
          <button className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center">
            Save as Draft
          </button>
          <button
            className="py-2 px-4 bg-primary-900 text-white rounded-md text-center"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
