"use client";

import {
  faRepeat,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import Select from "react-select";
import Image from "next/image";
import { toast } from "react-toastify";
registerLocale("id", id);
import "quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { borderColor } from "@mui/system";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface IForm {
  handleShowForm: (value: boolean) => void;
  getNewData: () => void;
  type?: string;
  data?: IGame;
  hideEdit?: boolean;
}

function generateSlug(inputText: string): string {
  return inputText
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substr(0, 50);
}

const CATEGORY_ID_OPTIONS = [
  {
    label: "Game Mobile",
    value: "3478fb31-a9c0-42c1-ac17-7e8a5890b9d5",
  },
  {
    label: "Game PC",
    value: "87dc9cb8-28d0-45cd-a293-1b99b3047bd3",
  },
];

const GAME_TYPE_OPTIONS = [
  {
    label: "Voucher",
    value: "voucher",
  },
  {
    label: "TopUp",
    value: "topup",
  },
];

const SERVER_ID_TYPE = [
  {
    label: "Input Manual",
    value: "input",
  },
  {
    label: "List",
    value: "list",
  },
];

type InputData = {
  label: string;
  value: string;
};

const FormGame: React.FC<IForm> = ({
  handleShowForm,
  getNewData,
  type,
  data,
  hideEdit,
}) => {
  const modules = {
    toolbar: [["bold", "italic", "underline"]],
  };

  const [currentKeyword, setCurrentKeyword] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputData, setInputData] = useState<
    { label: string; value: string }[]
  >([]);

  const handleAddInput = () => {
    setInputData([...inputData, { label: "", value: "" }]);
  };

  const handleChange = (
    index: number,
    field: keyof InputData,
    value: string
  ) => {
    const updatedData = [...inputData];
    //@ts-ignore
    updatedData[index][field] = value;
    setInputData(updatedData);
  };

  const inputFileLogoUrl = useRef<HTMLInputElement | null>(null);
  const inputFileLogoDenom = useRef<HTMLInputElement | null>(null);
  const [hoverImageLogoUrl, setHoverImageLogoUrl] = useState(false);
  const [hoverImageLogoDenom, setHoverImageLogoDenom] = useState(false);
  const [newData, setNewData] = useState({
    desc: "",
    keywords: [] as string[],
    categoryId: "",
    name: "",
    isPopular: false,
    slug: "",
    needServerId: false,
    typeServerId: "",
    type: "",
    voucherType: "",
    logoUrl: "",
    logoDenom: "",
    fileImageLogoUrl: {} as any,
    fileImageLogoDenom: {} as any,
  });

  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckedVoucherInternal, setIsCheckedVoucherInternal] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedServerIdType, setSelectedServerIdType] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

  const saveData = async () => {
    setLoading(true);
    const toastId = toast.loading(
      `Sedang ${typeForm === "edit" ? "mengubah" : "menyimpan"} data...`
    );
    const formData = new FormData();
    if (typeForm === "edit" && data) {
      formData.append("id", data.id);
    }
    if (
      (typeForm === "edit" && newData.logoDenom !== data?.logoDenom) ||
      (typeForm === "add" && Object.keys(newData.fileImageLogoDenom).length > 0)
    ) {
      formData.append("logoDenom", newData.fileImageLogoDenom);
    }

    if (
      (typeForm === "edit" && newData.logoUrl !== data?.logoUrl) ||
      typeForm === "add"
    ) {
      formData.append("logoUrl", newData.fileImageLogoUrl);
    }

    formData.append("desc", newData.desc);
    formData.append("keywords", JSON.stringify(newData.keywords));
    formData.append("categoryId", newData.categoryId);
    formData.append("listServerId", JSON.stringify(inputData));
    formData.append("name", newData.name);
    formData.append("slug", newData.slug);
    formData.append("needServerId", newData.needServerId ? "true" : "false");
    formData.append("typeServerId", newData.typeServerId);
    formData.append("type", newData.type);
    formData.append("voucherType", newData.voucherType);

    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game", {
      cache: "no-cache",
      method: typeForm === "edit" ? "PUT" : "POST",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    if (req.ok) {
      getNewData();
      toast.update(toastId, {
        render: `Berhasil ${
          typeForm === "edit" ? "Mengubah" : "Menambahkan"
        } Data Produk`,
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render: res.message,
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
    handleShowForm(false);
  };

  useEffect(() => {
    if (
      (typeForm === "add" || typeForm === "edit") &&
      (!newData.categoryId ||
        !newData.name ||
        !newData.slug ||
        (newData.type === "topup" &&
          newData.needServerId &&
          !newData.typeServerId) ||
        !newData.type ||
        !newData.logoUrl ||
        newData.keywords.length === 0 ||
        !newData.desc ||
        (newData.typeServerId === "list" && inputData.length === 0) ||
        (typeForm === "edit" &&
          newData.name === data?.name &&
          newData.slug === data?.slug &&
          newData.needServerId === data?.needServerId &&
          newData.typeServerId === data?.typeServerId &&
          newData.type === data?.type &&
          newData.voucherType === data?.voucherType &&
          newData.logoDenom === data?.logoDenom &&
          newData.logoUrl === data?.logoUrl &&
          newData.keywords.length ===
            JSON.parse(data?.keywords || "[]").length &&
          newData.desc === data?.description &&
          JSON.stringify(inputData) === JSON.stringify(data?.listServer)))
    ) {
      setDisableButtonSubmit(true);
    } else {
      setDisableButtonSubmit(false);
    }
  }, [
    newData.name,
    newData.isPopular,
    newData.slug,
    newData.logoDenom,
    newData.needServerId,
    newData.typeServerId,
    newData.type,
    typeForm,
    newData.voucherType,
    newData.logoDenom,
    newData.logoUrl,
    newData.keywords.length,
    newData.desc,
    JSON.stringify(inputData),
  ]);

  useEffect(() => {
    // getGames();
    if (type !== "add" && data) {
      setNewData({
        categoryId: data.categoryId,
        name: data.name,
        isPopular: data.isPopular,
        slug: data.slug,
        logoDenom: data.logoDenom,
        needServerId: data.needServerId,
        typeServerId: data.typeServerId,
        type: data.type,
        voucherType: data.voucherType,
        logoUrl: data.logoUrl,
        fileImageLogoUrl: {} as any,
        fileImageLogoDenom: {} as any,
        keywords: JSON.parse(data.keywords || "[]"),
        desc: data.description,
      });

      if (
        data.needServerId &&
        data.typeServerId === "list" &&
        data.listServer
      ) {
        setInputData(data.listServer);
      }
      const gameType = GAME_TYPE_OPTIONS.find(
        (item) => item.value === data?.type
      );
      if (gameType) {
        setSelectedGameType(gameType);
      }

      const gameCategory = CATEGORY_ID_OPTIONS.find(
        (item) => item.value === data?.categoryId
      );
      if (gameCategory) {
        setSelectedCategoryId(gameCategory);
      }

      const serverId = SERVER_ID_TYPE.find(
        (item) => item.value === data?.typeServerId
      );
      if (serverId) {
        setSelectedServerIdType(serverId);
      }

      if (data?.voucherType === "internal") {
        setIsCheckedVoucherInternal(true);
      }
    }

    setTypeForm(type || "");
  }, []);

  const handleClick = (type: "logoUrl" | "logoDenom") => {
    if (type === "logoDenom" && inputFileLogoDenom.current) {
      inputFileLogoDenom.current.click();
    }

    if (type === "logoUrl" && inputFileLogoUrl.current) {
      inputFileLogoUrl.current.click();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logoUrl" | "logoDenom"
  ) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      displayImage(selectedFile, type);
    }
  };

  const displayImage = (file: File, type: "logoUrl" | "logoDenom") => {
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg"
    ) {
      return toast.error("Format gambar tidak didukung", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        let data = {};

        if (type === "logoDenom") {
          data = {
            logoDenom: imageSrc,
            fileImageLogoDenom: file,
          };
        } else {
          data = {
            logoUrl: imageSrc,
            fileImageLogoUrl: file,
          };
        }

        setNewData((prev) => ({
          ...prev,
          ...data,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveData();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        textareaRef.current.value.length;
    }
  }, [currentKeyword]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      if (currentKeyword) {
        setNewData((prev) => {
          return {
            ...prev,
            keywords: [...prev.keywords, currentKeyword],
          };
        });
        setCurrentKeyword("");
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentKeyword(event.target.value);
  };

  return (
    <div className="w-full h-full bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50">
      <div className="md:w-2/5 w-full bg-white shadow p-8 rounded-xl overflow-y-hidden relative">
        <div className="flex justify-between border-b-2 pb-4 border-gray-200 items-center">
          <h1 className="text-xl font-medium text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Produk Baru"
              : typeForm === "edit"
              ? `Ubah Produk ${data?.name}`
              : `Detail Produk ${data?.name}`}
          </h1>
          <div
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
            onClick={() => handleShowForm(false)}
          >
            <div className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all">
              <FontAwesomeIcon
                icon={faTimes}
                className="text-primary-900 group-hover:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="h-[80vh] overflow-y-scroll">
          <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="w-full flex mt-4 gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Logo Produk{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                {newData.logoUrl ? (
                  <div
                    onMouseEnter={() => setHoverImageLogoUrl(true)}
                    onMouseLeave={() => setHoverImageLogoUrl(false)}
                    className="w-[140px] aspect-square mt-4 relative"
                  >
                    {hoverImageLogoUrl && typeForm !== "detail" && (
                      <div className="w-full h-full flex absolute bg-gray-800 bg-opacity-70 items-center justify-evenly p-2 rounded-md">
                        {type === "detail" &&
                          data &&
                          data?.logoUrl !== newData.logoUrl && (
                            <button
                              data-tooltip-id="tooltip-reset"
                              data-tooltip-content="Reset"
                              onClick={() => {
                                setNewData((prev) => ({
                                  ...prev,
                                  logoUrl: data.logoUrl,
                                }));
                                setHoverImageLogoUrl(false);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faRepeat}
                                className="text-white text-lg"
                              />
                              <ReactTooltip
                                id="tooltip-reset"
                                style={{
                                  fontSize: "12px",
                                  padding: "10px",
                                }}
                              />
                            </button>
                          )}
                        <button
                          data-tooltip-id="tooltip-delete"
                          data-tooltip-content="Hapus"
                          onClick={() => {
                            setNewData((prev) => ({
                              ...prev,
                              logoUrl: "",
                            }));
                            setHoverImageLogoUrl(false);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-white text-lg"
                          />
                          <ReactTooltip
                            id="tooltip-delete"
                            style={{
                              fontSize: "12px",
                              padding: "10px",
                            }}
                          />
                        </button>
                      </div>
                    )}
                    {newData.logoUrl && (
                      <Image
                        src={newData.logoUrl}
                        alt={"Logo Produk"}
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div
                    onClick={(e) => handleClick("logoUrl")}
                    className="w-[140px] aspect-square mt-4 border-2 border-dashed border-primary-900 flex justify-center items-center bg-primary-50"
                  >
                    <input
                      type="file"
                      name="imageLogoUrl"
                      id="imageLogoUrl"
                      accept=".png, .jpg, .jpeg"
                      hidden
                      readOnly={typeForm === "detail"}
                      ref={inputFileLogoUrl}
                      onChange={(e) => handleFileInputChange(e, "logoUrl")}
                    />
                    <p className="text-gray-600 text-center text-xs p-4">
                      Click here to upload
                    </p>
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Logo Denom
                </label>
                <div className="w-[140px] aspect-square mt-4">
                  {newData.logoDenom ? (
                    <div
                      onMouseEnter={() => setHoverImageLogoDenom(true)}
                      onMouseLeave={() => setHoverImageLogoDenom(false)}
                      className="w-[140px] aspect-square mt-4 relative"
                    >
                      {hoverImageLogoDenom && typeForm !== "detail" && (
                        <div className="w-full h-full flex absolute bg-gray-800 bg-opacity-70 items-center justify-evenly p-2 rounded-md">
                          {type === "detail" &&
                            data &&
                            data?.logoDenom !== newData.logoDenom && (
                              <button
                                data-tooltip-id="tooltip-reset"
                                data-tooltip-content="Reset"
                                onClick={() => {
                                  setNewData((prev) => ({
                                    ...prev,
                                    logoDenom: data.logoDenom,
                                  }));
                                  setHoverImageLogoDenom(false);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faRepeat}
                                  className="text-white text-lg"
                                />
                                <ReactTooltip
                                  id="tooltip-reset"
                                  style={{
                                    fontSize: "12px",
                                    padding: "10px",
                                  }}
                                />
                              </button>
                            )}
                          <button
                            data-tooltip-id="tooltip-delete"
                            data-tooltip-content="Hapus"
                            onClick={() => {
                              setNewData((prev) => ({
                                ...prev,
                                logoDenom: "",
                              }));
                              setHoverImageLogoDenom(false);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-white text-lg"
                            />
                            <ReactTooltip
                              id="tooltip-delete"
                              style={{
                                fontSize: "12px",
                                padding: "10px",
                              }}
                            />
                          </button>
                        </div>
                      )}
                      {newData.logoDenom && (
                        <Image
                          src={newData.logoDenom}
                          alt={"Logo Produk"}
                          width="0"
                          height="0"
                          sizes="100vw"
                          style={{ width: "100%", height: "100%" }}
                          className="rounded-lg object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {typeForm === "detail" ? (
                        <div className="w-full h-full bg-white border-2 rounded flex items-center justify-center p-4 text-xs text-neutral-600 text-center border-dashed border-gray-400">
                          Tidak ada logo denom
                        </div>
                      ) : (
                        <div
                          onClick={(e) => handleClick("logoDenom")}
                          className="w-[140px] aspect-square mt-4 border-2 border-dashed border-primary-900 flex justify-center items-center bg-primary-50"
                        >
                          <input
                            type="file"
                            name="imageLogoDenom"
                            id="imageLogoDenom"
                            accept=".png, .jpg, .jpeg"
                            hidden
                            readOnly={typeForm === "detail"}
                            ref={inputFileLogoDenom}
                            onChange={(e) =>
                              handleFileInputChange(e, "logoDenom")
                            }
                          />
                          <p className="text-gray-600 text-center text-xs p-4">
                            Click here to upload
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Nama Game{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <input
                    disabled={typeForm === "detail"}
                    required
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Mobile Legends"
                    autoComplete="off"
                    value={newData.name}
                    onChange={(e) => {
                      setNewData((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      }));
                    }}
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                        : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                    } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="slug"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Slug{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <input
                    disabled={typeForm === "detail"}
                    required
                    type="text"
                    name="slug"
                    id="slug"
                    placeholder="mobile-legends"
                    autoComplete="off"
                    value={newData.slug}
                    onChange={(e) =>
                      setNewData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                        : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                    } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Game Kategori{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <Select
                    id="gameCategory"
                    value={selectedCategoryId}
                    onChange={(e: any) => {
                      setNewData((prev) => ({
                        ...prev,
                        categoryId: e.value,
                      }));

                      setSelectedCategoryId(e);
                    }}
                    options={CATEGORY_ID_OPTIONS}
                    isDisabled={typeForm === "detail"}
                    placeholder="Game Kategori"
                    styles={{
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: typeForm === "detail" ? "#cccccc" : "#b72025",
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        color: "#4B5563",
                        backgroundColor:
                          typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                        "&:hover": {
                          backgroundColor:
                            typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                        },
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                        border:
                          typeForm === "detail" ? "none" : "1px solid #B72025",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: typeForm === "detail" ? "#4B5563" : "#B72025",
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#B72025" : "white",
                        color: state.isSelected ? "white" : "#333",
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Tipe Game{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <Select
                    id="gameType"
                    value={selectedGameType}
                    onChange={(e: any) => {
                      setNewData((prev) => ({
                        ...prev,
                        type: e.value,
                      }));

                      setSelectedGameType(e);
                    }}
                    options={GAME_TYPE_OPTIONS}
                    isDisabled={typeForm === "detail"}
                    placeholder="Tipe Game"
                    styles={{
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: typeForm === "detail" ? "#cccccc" : "#b72025",
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        color: "#4B5563",
                        backgroundColor:
                          typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                        "&:hover": {
                          backgroundColor:
                            typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                        },
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                        border:
                          typeForm === "detail" ? "none" : "1px solid #B72025",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: typeForm === "detail" ? "#4B5563" : "#B72025",
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#B72025" : "white",
                        color: state.isSelected ? "white" : "#333",
                        cursor:
                          typeForm === "detail" ? "not-allowed" : "pointer",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            {newData.type === "voucher" && (
              <div className="mt-4 flex gap-4 items-center">
                <input
                  type="checkbox"
                  name="voucherInternal"
                  id="voucherInternal"
                  disabled={typeForm === "detail"}
                  className="cursor-pointer"
                  checked={isCheckedVoucherInternal}
                  onChange={(e) => {
                    setNewData((prev) => ({
                      ...prev,
                      voucherType: e.target.checked ? "internal" : "external",
                    }));

                    setIsCheckedVoucherInternal(e.target.checked);
                  }}
                />
                <label htmlFor="voucherInternal">Voucher Internal</label>
              </div>
            )}
            {newData.type === "topup" && (
              <>
                <div className="mt-4 flex gap-4 items-center">
                  <input
                    type="checkbox"
                    name="needServerId"
                    id="needServerId"
                    className="cursor-pointer"
                    checked={newData.needServerId}
                    disabled={typeForm === "detail"}
                    onChange={(e) =>
                      setNewData((prev) => ({
                        ...prev,
                        needServerId: e.target.checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="needServerId"
                    className="cursor-pointer font-medium text-base text-neutral-900 inline-block"
                  >
                    Apakah Membutuhkan Server Id?
                  </label>
                </div>
                {newData.needServerId && (
                  <div className="mt-4 gap-4 w-1/2">
                    <label
                      htmlFor="serverIdType"
                      className="font-medium text-base text-neutral-900 inline-block"
                    >
                      Tipe Server Id{" "}
                      {typeForm !== "detail" && (
                        <span className="text-red-800 font-bold">*</span>
                      )}
                    </label>
                    <div className="w-full mt-2">
                      <Select
                        id="serverIdType"
                        value={selectedServerIdType}
                        onChange={(e: any) => {
                          setNewData((prev) => ({
                            ...prev,
                            typeServerId: e.value,
                          }));

                          setSelectedServerIdType(e);
                        }}
                        options={SERVER_ID_TYPE}
                        isDisabled={typeForm === "detail"}
                        placeholder="Tipe Server Id"
                        styles={{
                          dropdownIndicator: (base) => ({
                            ...base,
                            color:
                              typeForm === "detail" ? "#cccccc" : "#b72025",
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            paddingTop: "3px",
                            paddingBottom: "3px",
                            color: "#4B5563",
                            backgroundColor:
                              typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                            "&:hover": {
                              backgroundColor:
                                typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                            },
                            cursor:
                              typeForm === "detail" ? "not-allowed" : "pointer",
                            border:
                              typeForm === "detail"
                                ? "none"
                                : "1px solid #B72025",
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            color:
                              typeForm === "detail" ? "#4B5563" : "#B72025",
                            cursor:
                              typeForm === "detail" ? "not-allowed" : "pointer",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#B72025"
                              : "white",
                            color: state.isSelected ? "white" : "#333",
                            cursor:
                              typeForm === "detail" ? "not-allowed" : "pointer",
                            ":hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }),
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {newData.needServerId && newData.typeServerId === "list" && (
              <div className="w-full mt-4">
                <label
                  htmlFor="listServerId"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  List Server Id{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="p-4 bg-gray-100 rounded">
                  {inputData.map((data, index) => (
                    <div className="mt-4 flex gap-4" key={index}>
                      <div className="w-1/2">
                        <label
                          htmlFor={`name${index}`}
                          className="font-medium text-base text-neutral-900 inline-block"
                        >
                          Nama{" "}
                          {typeForm !== "detail" && (
                            <span className="text-red-800 font-bold">*</span>
                          )}
                        </label>
                        <div className="w-full mt-2">
                          <input
                            disabled={typeForm === "detail"}
                            required
                            type="text"
                            name={`name${index}`}
                            id={`name${index}`}
                            placeholder="KODE123"
                            autoComplete="off"
                            value={data.label}
                            onChange={(e) => {
                              handleChange(index, "label", e.target.value);
                            }}
                            className={`${
                              typeForm === "detail"
                                ? "cursor-not-allowed bg-gray-100"
                                : "bg-white bg-opacity-100"
                            } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                          />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <label
                          htmlFor={`code${index}`}
                          className="font-medium text-base text-neutral-900 inline-block"
                        >
                          Kode{" "}
                          {typeForm !== "detail" && (
                            <span className="text-red-800 font-bold">*</span>
                          )}
                        </label>
                        <div className="w-full mt-2">
                          <input
                            disabled={typeForm === "detail"}
                            required
                            type="text"
                            name={`code${index}`}
                            id={`code${index}`}
                            placeholder="Event 10.10"
                            autoComplete="off"
                            value={data.value}
                            onChange={(e) =>
                              handleChange(index, "value", e.target.value)
                            }
                            className={`${
                              typeForm === "detail"
                                ? "cursor-not-allowed bg-gray-100"
                                : "bg-white bg-opacity-100"
                            } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                          />
                        </div>
                      </div>
                      <button
                        className={`${
                          typeForm !== "detail"
                            ? "bg-[#B72025] text-white cursor-pointer"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        } mt-8 h-10 aspect-square rounded shadow`}
                        type="button"
                        disabled={typeForm === "detail"}
                        onClick={(e) => {
                          const newData = [...inputData];
                          newData.splice(index, 1);
                          setInputData(newData);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddInput}
                  type="button"
                  disabled={typeForm === "detail"}
                  className={`${
                    typeForm === "detail"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-400 text-gray-600 cursor-pointer"
                  } w-full py-4 font-bold`}
                >
                  Tambah List Server Id
                </button>
              </div>
            )}
            <div className="w-full mt-4 gap-4 items-end">
              {typeForm !== "detail" && (
                <div className="w-full">
                  <label
                    htmlFor="desc"
                    className="font-medium text-base text-neutral-900 inline-block mb-2"
                  >
                    Keywords{" "}
                    {typeForm !== "detail" && (
                      <span className="text-red-800 font-bold">*</span>
                    )}
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={currentKeyword}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={typeForm === "detail"}
                    placeholder="Type and press Tab..."
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                        : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
                    } w-full h-12 max-h-40 py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden resize-none`}
                  />
                </div>
              )}
              <div className="w-full">
                {typeForm === "detail" && (
                  <p className="font-medium text-base text-neutral-900 inline-block mb-2">
                    Keywords
                  </p>
                )}
                <div
                  className={`rounded-md p-3 px-4 h-40 overflow-y-auto border ${
                    typeForm !== "detail"
                      ? "bg-primary-50 border-primary-900"
                      : "bg-gray-100"
                  }`}
                >
                  {newData.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className={`${
                        typeForm !== "detail"
                          ? "bg-[#B72025] cursor-pointer text-white"
                          : "bg-gray-200 cursor-not-allowed text-black"
                      }  rounded px-2 py-1 m-1 inline-block `}
                      onClick={() => {
                        if (typeForm !== "detail") {
                          const updatedKeywords = [...newData.keywords];
                          updatedKeywords.splice(index, 1);
                          setNewData((prev) => ({
                            ...prev,
                            keywords: updatedKeywords,
                          }));
                        }
                      }}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full mt-4">
              <label
                htmlFor="desc"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Deskripsi{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              <ReactQuill
                theme="snow"
                value={newData.desc}
                onChange={(e) => setNewData((prev) => ({ ...prev, desc: e }))}
                modules={modules}
                id="desc"
                readOnly={typeForm === "detail"}
                className={`${
                  typeForm === "detail"
                    ? "cursor-not-allowed bg-gray-100"
                    : "edit bg-primary-50 bg-opacity-100"
                } focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md mt-4 w-full min-h-[10rem]`}
              />
            </div>
            {typeForm === "detail" && !hideEdit && (
              <div className="flex justify-end space-x-2 bg-white py-5">
                <button
                  onClick={() => setTypeForm("edit")}
                  type="button"
                  className={
                    "bg-primary-900 hover:bg-red-600 text-white font-medium w-24 py-3 rounded-md transition-all"
                  }
                >
                  Edit
                </button>
              </div>
            )}
            {typeForm !== "detail" && (
              <div className="flex gap-4 justify-end bg-white py-5">
                {loading ? (
                  <>
                    <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                    <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleShowForm(false)}
                      type="button"
                      className="bg-primary-50 hover:bg-primary-900 hover:text-white text-primary-900 font-medium w-24 py-3 rounded-md border border-primary-900 transition-all"
                    >
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      disabled={disableButtonSubmit}
                      className={`${
                        disableButtonSubmit
                          ? "bg-opacity-50 cursor"
                          : "bg-opacity-100 hover:bg-red-600"
                      } bg-primary-900 text-white font-medium w-24 py-3 rounded-md transition-all`}
                    >
                      Simpan
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormGame;
