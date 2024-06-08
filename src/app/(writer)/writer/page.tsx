"use client";

import Loading from "@/components/global/loading/CompLoading";
import { ROLES } from "@/enum";
import {
  faChevronDown,
  faGear,
  faMountainSun,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Image from "next/image";

export default function Writer() {
  const [isAuthorized, seIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [permalink, setPermalink] = useState("");
  const [permalinkType, setPermalinkType] = useState("custom");
  const [checked, setChecked] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [displayImage, setDisplayImage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

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
      setDisplayImage(imgUrl);
    } else {
      setDisplayImage("");
    }
  }, [selectedImage]);

  console.log({ isLoading, isAuthorized });

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
              className="w-full px-0 py-2 palceholder:text-gray-100 font-bold text-4xl placeholder:text-4xl border-0"
              placeholder="|Tambah Judul"
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
            {displayImage && (
              <Image
                src={displayImage}
                fill={true}
                alt="blog-banner"
                objectFit="cover"
              />
            )}
          </div>
          <div>
            <Editor
            // setValue={(val: string) => {
            //   setContent(val);
            // }}
            // typeForm={"edit"}
            // value={content}
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
              https://gasskeuntopup.com/{permalink}
            </p>
            <input
              type="text"
              value={permalink}
              onChange={(e) => setPermalink(e.target.value)}
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
            <div className="bg-emerald-100 w-max py-2 px-4 rounded-full hover:cursor-pointer text-emerald-700">
              <p className="text-sm">Game</p>
            </div>
            <div className="bg-emerald-100 w-max py-2 px-4 rounded-full hover:cursor-pointer text-emerald-700">
              <p className="text-sm">E-Sport</p>
            </div>
            <div className="bg-slate-100 w-max py-2 px-4 rounded-full hover:cursor-pointer text-slate-600">
              <p className="text-sm">Mobile Legend</p>
            </div>
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
            />
            <input
              type="text"
              className="w-full p-2 rounded-md border-slate-300 focus:border-slate-500 text-sm mt-3"
              placeholder="destinasi"
            />
          </div>
        </div>

        <div className="buttons flex lg:flex-col xl:flex-row gap-4 lg:gap-3 xl:gap-4 justify-center mt-4">
          <button className="py-2 px-4 text-primary-900 border border-primary-900 rounded-md text-center">
            Save as Draft
          </button>
          <button className="py-2 px-4 bg-primary-900 text-white rounded-md flex gap-2 items-center justify-center text-center">
            Publish
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}
