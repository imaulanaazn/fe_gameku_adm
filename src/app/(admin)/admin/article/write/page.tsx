"use client";

import { ROLES } from "@/enum";
import {
  faChevronDown,
  faGear,
  faMountainSun,
  faPaperPlane,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
const Editor = dynamic(() => import("./components/Editor"), { ssr: false });
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface IContentSettings {
  contentPreview: string;
  permalink: string;
  categories: string[];
  actionBtn: {
    name: string;
    url: string;
  }[];
}

const dummyCategories = [
  { id: "1", name: "Games" },
  { id: "2", name: "Valorant" },
  { id: "3", name: "AOT" },
];

const initialConent = {
  title: "",
  image: "",
  content: "",
};

const initialContentSetting = {
  contentPreview: "",
  permalink: "",
  categories: [],
  actionBtn: [],
};

export default function Page() {
  const [isAuthorized, seIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(initialConent);
  const [contentSettings, setContentSettings] = useState<IContentSettings>(
    initialContentSetting
  );
  const [checked, setChecked] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [categories, setCategories] = useState(dummyCategories);
  const [tempActBtn, setTempActBtn] = useState({ name: "", url: "" });

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

  async function handleSubmit(param: { articleStatus: string }) {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", content.title);
    formData.append("slug", contentSettings.permalink);
    formData.append("content", content.content);
    formData.append("contentPreview", contentSettings.contentPreview);
    formData.append("button", JSON.stringify(contentSettings.actionBtn));
    formData.append("categoryIds", JSON.stringify(contentSettings.categories));
    formData.append("status", param.articleStatus);
    formData.append("isPopular", "false");
    formData.append("banner", selectedImage);

    try {
      const response = await fetch(`${BASE_URL}/v1/article`, {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(
          param.articleStatus === "PUBLISH"
            ? "Blog dipublish"
            : `Blog disimpan kedalam ${param.articleStatus}`
        );
        clearForm();
      } else {
        const data = await response.json();
        if (data.message) {
          toast.error(data.message);
        } else {
          toast.error("Gagal mengunggah blog");
        }
        console.error("Blog upload failed");
      }
    } catch (error) {
      console.error("Error uploading blog:", error);
    }
  }

  const handleCategory = (categoryId: string) => {
    setContentSettings((prev) => {
      const isSelected = prev.categories.some((catId) => catId === categoryId);
      const newCategories = isSelected
        ? prev.categories.filter((catId) => catId !== categoryId)
        : [...prev.categories, categoryId];

      return { ...prev, categories: newCategories };
    });
  };

  const isCategorySelected = (categoryId: string) => {
    return contentSettings.categories.some((catId) => catId === categoryId);
  };

  function handleAddButton() {
    setContentSettings((prev) => ({
      ...prev,
      actionBtn: [
        ...prev.actionBtn,
        { name: tempActBtn.name, url: tempActBtn.url },
      ],
    }));
    setTempActBtn({ name: "", url: "" });
  }

  function clearForm() {
    setContentSettings(initialContentSetting);
    setContent(initialConent);
  }

  const handleDeleteButton = (index: number) => {
    setContentSettings((prev) => {
      const newActionBtn = [...prev.actionBtn];
      newActionBtn.splice(index, 1);
      return { ...prev, actionBtn: newActionBtn };
    });
  };

  if (isLoading) return <div>Loading...</div>;
  // if (!isAuthorized)
  //   return <div>You don't have permission to access this page.</div>;

  return (
    <div className="w-full relative h-screen overflow-y-scroll">
      <div className="w-full py-4 bg-white sticky top-0 right-0 z-40">
        <div className="w-full px-12 mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Create New Blogs</h1>
          <div className="buttons flex lg:flex-col xl:flex-row gap-4 lg:gap-3 xl:gap-4 justify-center">
            <button
              onClick={() => {
                handleSubmit({ articleStatus: "ARCHIVE" });
              }}
              className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center"
            >
              Save as Archived
            </button>
            <button
              onClick={() => {
                handleSubmit({ articleStatus: "DRAFT" });
              }}
              className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center"
            >
              Save as Draft
            </button>
            <button
              className="py-2 px-4 bg-primary-900 text-white rounded-md flex gap-2 items-center justify-center text-center"
              onClick={() => {
                handleSubmit({ articleStatus: "PUBLISH" });
              }}
            >
              Publish
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
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
              <FontAwesomeIcon
                icon={faGear}
                className="text-xl text-gray-600"
              />
            </button>
            <div>
              <input
                required
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
            <div className="w-full bg-slate-100 h-96 flex items-center justify-center relative hover:brightness-90">
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
              <FontAwesomeIcon
                icon={faXmark}
                className="text-xl text-gray-600"
              />
            </button>
          </div>
          <div className="w-full text-xs sm:text-sm flex items-center gap-x-3 flex-wrap select-none">
            <input
              type="checkbox"
              id="options0"
              checked={"options0" === checked}
              className="peer appearance-none opacity-0 w-0 h-0"
              onChange={() => {
                setChecked((prev) => (prev === "options0" ? "" : "options0"));
              }}
            />
            <label
              htmlFor="options0"
              className="py-4 cursor-pointer grow flex items-center gap-2"
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`${
                  "options0" === checked ? "rotate-180" : "rotate-0"
                } text-gray-500 transition-all text-base`}
              />
              <p className="text-gray-500 text-base">Content Preview</p>
            </label>
            <div className="peer-checked:max-h-max max-h-0 basis-full border-b peer-checked:py-3 overflow-hidden transition-all select-text">
              <textarea
                value={contentSettings.contentPreview}
                onChange={(e) =>
                  setContentSettings((prev) => ({
                    ...prev,
                    contentPreview: e.target.value,
                  }))
                }
                className="w-full p-2 mt-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
                placeholder="write preview"
              ></textarea>
            </div>
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
          <div className="w-full text-xs sm:text-sm flex items-center gap-x-3 flex-wrap select-none">
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
                  onClick={() => handleCategory(category.id)}
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
              {contentSettings.actionBtn.length > 0 && (
                <div className="article_buttons flex gap-2 flex-wrap">
                  {contentSettings.actionBtn.map((button, index) => (
                    <div className="relative" key={index}>
                      <div
                        onClick={() => handleDeleteButton(index)}
                        className="cursor-pointer"
                        data-tooltip-id={button.name}
                        data-tooltip-content={button.url}
                      >
                        <div className="py-1.5 px-3 rounded-full bg-primary-900 text-white w-max">
                          {button.name}
                        </div>
                      </div>
                      <ReactTooltip
                        id={button.name}
                        style={{
                          fontSize: "12px",
                          padding: "10px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                className="w-full p-2 rounded-md border-slate-300 focus:border-slate-500 text-sm mt-4"
                placeholder="nama button"
                value={tempActBtn.name}
                onChange={(e) => {
                  setTempActBtn((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
              <input
                type="text"
                className="w-full p-2 rounded-md border-slate-300 focus:border-slate-500 text-sm mt-2"
                placeholder="destinasi"
                value={tempActBtn.url}
                onChange={(e) => {
                  setTempActBtn((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }));
                }}
              />
              <div className="flex justify-end mt-2">
                <button
                  className="py-2 px-4 bg-primary-900 text-white rounded-md flex gap-2 items-center justify-center"
                  onClick={handleAddButton}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
