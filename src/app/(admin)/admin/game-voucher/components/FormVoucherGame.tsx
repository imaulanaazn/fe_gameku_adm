"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

interface IFormAdmin {
  handleShowForm: (value: boolean) => void;
  getNewData: () => void;
  type?: string;
  dataDetail?: IVoucherGame;
}

const FormVoucherGame: React.FC<IFormAdmin> = ({
  handleShowForm,
  getNewData,
  type,
  dataDetail,
}) => {
  const [data, setData] = useState<{
    gameId: string;
    productId: string;
    code: string | string[];
  }>({
    gameId: "",
    productId: "",
    code: "",
  });
  const [selectedOptionGame, setSelectedOptionGame] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedOptionProduct, setSelectedOptionProduct] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [game, setGame] = useState<{ label: string; value: string }[]>([]);
  const [product, setProduct] = useState<{ label: string; value: string }[]>(
    []
  );
  const [typeForm, setTypeForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

  const postData = async () => {
    let body = JSON.stringify(data);
    if (typeForm === "edit") {
      body = JSON.stringify({ ...data, id: dataDetail?.id });
    }
    setLoading(true);
    const toastId = toast.loading(
      typeForm === "edit"
        ? "Sedang mengubah data voucher game..."
        : "Sedang menyimpan data voucher game..."
    );
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/voucher-game",
      {
        cache: "no-cache",
        method: typeForm === "edit" ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body,
      }
    );

    if (req.ok) {
      getNewData();
      toast.update(toastId, {
        render: `Berhasil ${
          typeForm === "edit" ? "Mengubah" : "Menambahkan"
        } Data Voucher Game`,
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

  const getGames = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/game/attr?conditional=voucher_type:internal",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      const data = res.map((data: any) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      setGame(data);
    }
  };

  const getProducts = async (gameId: string) => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        "/v1/denom/attr?conditional=game_id:" +
        gameId,
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      const data = res.map((data: any) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      setProduct(data);
    }
  };

  const handleCreatePromoCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData();
  };

  useEffect(() => {
    if (
      (typeForm === "add" || typeForm === "edit") &&
      (!data.gameId ||
        !data.productId ||
        !data.code ||
        (typeForm === "edit" &&
          data.gameId === dataDetail?.gameId &&
          data.productId === dataDetail.productId &&
          data.code === dataDetail.code))
    ) {
      setDisableButtonSubmit(true);
    } else {
      setDisableButtonSubmit(false);
    }
  }, [data.gameId, data.productId, data.code, typeForm]);

  useEffect(() => {
    if (type !== "add" && dataDetail) {
      setData({
        gameId: dataDetail.gameId,
        productId: dataDetail.productId,
        code: dataDetail.code,
      });
    }

    setTypeForm(type || "");
    getGames();
  }, []);

  useEffect(() => {
    data.gameId && getProducts(data.gameId);
  }, [data.gameId]);

  useEffect(() => {
    if (type !== "add" && dataDetail) {
      const checkGame = game.find((item) => item.value === dataDetail.gameId);
      if (checkGame) {
        setSelectedOptionGame(checkGame);
      }
    }
  }, [game]);

  useEffect(() => {
    if (type !== "add" && dataDetail) {
      const checkProduct = product.find(
        (item) => item.value === dataDetail.productId
      );
      if (checkProduct) {
        setSelectedOptionProduct(checkProduct);
      }
    }
  }, [product]);

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-50">
      <div className="md:w-2/5 h-screen md:max-h-full w-full bg-white p-6 lg:p-8 md:rounded-xl overflow-y-auto relative">
        <div className="flex justify-between border-b-2 pb-4 border-gray-200 items-center">
          <h1 className="text-xl font-medium text-2xl text-neutral-800">
            {typeForm === "add"
              ? "Tambah Voucher Game Baru"
              : typeForm === "edit"
              ? `Ubah Voucher Game`
              : `Detail Voucher Game`}
          </h1>
          <div
            onClick={() => handleShowForm(false)}
            className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-primary-900 group-hover:text-white transition-all"
            />
          </div>
        </div>
        <form onSubmit={handleCreatePromoCode}>
          <div className="flex flex-col lg:flex-row gap-4 py-3">
            <div className="flex flex-col gap-2 w-full lg:w-1/2">
              <label
                htmlFor="code"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Kode Voucher {typeForm === "add" && "(Bisa lebih dari 1)"}{" "}
                {typeForm !== "detail" && (
                  <span className="text-red-800 font-bold">*</span>
                )}
              </label>
              {typeForm === "add" && (
                <div className="w-full">
                  <textarea
                    name="code"
                    id="code"
                    cols={30}
                    rows={10}
                    value={data.code}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder={`XXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX`}
                    className="bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900 w-full h-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-y-auto resize-none"
                  />
                </div>
              )}

              {typeForm !== "add" && (
                <div className="w-full">
                  <input
                    disabled={typeForm === "detail"}
                    required
                    type="text"
                    name="code"
                    id="code"
                    placeholder="10000"
                    autoComplete="off"
                    value={data.code}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100"
                        : "bg-white bg-opacity-100"
                    } border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                  />
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              <div>
                <label
                  htmlFor="game"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Pilih Game{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <Select
                    id="game"
                    name="game"
                    value={selectedOptionGame}
                    onChange={(e: any) => {
                      setData((prev) => ({
                        ...prev,
                        gameId: e.value,
                      }));

                      setSelectedOptionGame(e);
                    }}
                    options={game}
                    placeholder="Pilih Game"
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
                    className="w-full"
                    isDisabled={game.length === 0 || typeForm === "detail"}
                  />
                </div>
              </div>
              <div className="mt-2">
                <label
                  htmlFor="denom"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Pilih Denom{" "}
                  {typeForm !== "detail" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full mt-2">
                  <Select
                    id="denom"
                    name="denom"
                    value={selectedOptionProduct}
                    onChange={(e: any) => {
                      setData((prev) => ({
                        ...prev,
                        productId: e.value,
                      }));

                      setSelectedOptionProduct(e);
                    }}
                    options={product}
                    placeholder="Pilih Denom"
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
                    className="w-full"
                    isDisabled={
                      !data.gameId || !product || typeForm === "detail"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {typeForm === "detail" && (
            <div className="flex justify-end space-x-2 sticky -bottom-4 bg-white py-5">
              <button
                onClick={() => setTypeForm("edit")}
                type="button"
                className="bg-green-600 hover:bg-green-400 text-white font-semibold w-24 py-3 rounded-md"
              >
                Edit
              </button>
            </div>
          )}
          {typeForm !== "detail" && (
            <div className="flex justify-end gap-4 mt-4">
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
  );
};

export default FormVoucherGame;
