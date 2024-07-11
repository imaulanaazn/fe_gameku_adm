"use client";

import {
  faBoxArchive,
  faChevronDown,
  faGear,
  faMountainSun,
  faPaperPlane,
  faPlus,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
const Editor = dynamic(() => import("./components/Editor"), { ssr: false });
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Loading from "@/components/global/loading/CompLoading";
import { faFirstdraft } from "@fortawesome/free-brands-svg-icons";

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

interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  const [content, setContent] = useState(initialConent);
  const [contentSettings, setContentSettings] = useState<IContentSettings>(
    initialContentSetting
  );
  const [checked, setChecked] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [tempActBtn, setTempActBtn] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);
  const { articleId } = useParams();

  async function getArticle() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/article/${articleId}`, {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      setContentSettings({
        contentPreview: data.contentPreview,
        permalink: data.slug,
        categories: [],
        // categories: data.categories.map(
        //   (category: { id: string; name: string; slug: string }) =>
        //     category.id
        // ),
        actionBtn: data.buttons,
      });

      setContent({
        title: data.title,
        image: data.bannerImage,
        content: data.content,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getArticle();
    getCategories();
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
    if (!selectedImage && !content.image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", content.title);
    formData.append("slug", contentSettings.permalink);
    formData.append("content", content.content);
    formData.append(
      "contentPreview",
      contentSettings.contentPreview.slice(0, 100) + "..."
    );
    formData.append("button", JSON.stringify(contentSettings.actionBtn));
    formData.append("categoryIds", JSON.stringify(contentSettings.categories));
    formData.append("status", param.articleStatus);
    formData.append("isPopular", "false");

    if (selectedImage) {
      formData.append("banner", selectedImage);
    } else {
      try {
        const imageResponse = await fetch(content.image);
        const imageBlob = await imageResponse.blob();
        formData.append("banner", imageBlob, "image.jpg");
      } catch (error) {
        console.error("Error fetching image:", error);
        alert("Failed to fetch image.");
        return;
      }
    }

    try {
      const id = toast.loading("Sedang memperbarui artikel...");
      const response = await fetch(`${BASE_URL}/v1/article/${articleId}`, {
        cache: "no-cache",
        method: "PUT",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (response.ok) {
        toast.update(id, {
          render:
            param.articleStatus === "PUBLISH"
              ? "Artikel dipublish"
              : `Artikel disimpan kedalam ${param.articleStatus}`,
          type: "success",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
        getArticle();
      } else {
        const data = await response.json();

        toast.update(id, {
          render: data.message || "Gagal mengunggah artikel",
          type: "error",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error uploading artikel:", error);
    }
  }

  async function getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/v1/article-category`, {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
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

  const handleNewCategory = async () => {
    const toastId = toast.loading("Sedang menambahkan kategori...");
    try {
      const response = await fetch(`${BASE_URL}/v1/article-category`, {
        cache: "no-cache",
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ ...newCategory, description: "description" }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.update(toastId, {
          render: err.message || "Gagal menambahkan kategori",
          type: "error",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error("Error fetching data");
      }

      setNewCategory({ name: "", slug: "" });
      getCategories();
      toast.update(toastId, {
        render: "Berhasil menambahkan kategori",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    const toastId = toast.loading("Sedang menghapus kategori...");
    try {
      const response = await fetch(
        `${BASE_URL}/v1/article-category/${categoryId}`,
        {
          cache: "no-cache",
          method: "DELETE",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ ...newCategory, description: "description" }),
        }
      );

      if (!response.ok) {
        const err = await response.json();

        toast.update(toastId, {
          render: err.message || "Gagal menghapus kategori",
          type: "error",
          isLoading: false,
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error("Error fetching data");
      }

      toast.update(toastId, {
        render: "Kategori dihapus",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
      getCategories();
    } catch (error) {
      console.error(error);
    }
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

  const isCategorySelected = (categoryId: string) => {
    return contentSettings.categories.some((catId) => catId === categoryId);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
    }
  };

  const handleDeleteButton = (index: number) => {
    setContentSettings((prev) => {
      const newActionBtn = [...prev.actionBtn];
      newActionBtn.splice(index, 1);
      return { ...prev, actionBtn: newActionBtn };
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full relative h-screen overflow-y-scroll">
      <div className="w-full py-4 bg-white sticky top-0 right-0 z-40">
        <div className="w-full px-8 mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 md:pl-10">
            Update Your Blog
          </h1>
          <div className="buttons flex gap-4 lg:gap-3 xl:gap-4 justify-center">
            <button
              onClick={() => {
                handleSubmit({ articleStatus: "ARCHIVE" });
              }}
              className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center"
            >
              <span className="hidden md:inline">Save as Archived</span>
              <FontAwesomeIcon
                icon={faBoxArchive}
                className="inline md:hidden"
              />
            </button>
            <button
              onClick={() => {
                handleSubmit({ articleStatus: "DRAFT" });
              }}
              className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center"
            >
              <span className="hidden md:inline">Save as Draft</span>
              <FontAwesomeIcon
                icon={faFirstdraft}
                className="inline md:hidden"
              />
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
        <main className="w-full lg:w-9/12 xl mx-auto p-6 md:px-8">
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
                className="w-full px-0 py-2 palceholder:text-gray-100 font-bold text-3xl md:text-4xl placeholder:text-4xl border-0"
                placeholder="|Tambah Judul"
                onChange={(e) => {
                  setContent((prev) => ({ ...prev, title: e.target.value }));
                }}
              />
            </div>
            <div className="w-full bg-slate-100 h-60 md:h-96 flex items-center justify-center relative hover:brightness-90">
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
                  alt="artikel-banner"
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
          className={`options w-3/4 md:w-2/5 lg:w-3/12 px-4 py-8 md:py-6 bg-white h-[91vh] fixed lg:sticky top-24 md:top-16 right-0 transition-all duration-400 ${
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
                https://gasskeuntopup.com/article/{contentSettings.permalink}
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
                  } w-max py-1.5 pr-2 pl-4 rounded-full hover:cursor-pointer flex items-center gap-2`}
                  onClick={() => handleCategory(category.id)}
                >
                  <p className="text-sm">{category.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCategory(category.id);
                    }}
                    className="bg-slate-100 rounded-full w-7 h-7 hover:bg-primary-900 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faX} className="text-xs" />
                  </button>
                </div>
              ))}
              <div className="form kategori baru">
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  className="w-full p-2 mt-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
                  placeholder="Nama kategori baru"
                />
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => {
                    setNewCategory((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                  }}
                  className="w-full p-2 mt-2 rounded-md border-slate-300 focus:border-slate-500 text-sm"
                  placeholder="Slug kategori baru"
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="py-2 px-4 bg-primary-900 text-white rounded-md flex gap-2 items-center justify-center"
                    onClick={handleNewCategory}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Tambah
                  </button>
                </div>
              </div>
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
