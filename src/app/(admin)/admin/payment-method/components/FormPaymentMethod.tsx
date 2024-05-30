"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import { IPromotion } from "@/interfaces/promotion";
import { DiscountType, FeeType } from "@/enum";
import Select from "react-select";
import dayjs from "dayjs";
import formatter from "@/lib/formatter";
import Image from "next/image";
import Editor from "./Editor";

registerLocale("id", id);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface IForm {
  handleShowForm: (defaultValue: boolean) => void;
  type: string;
  paymentMethodData: IPaymentMethod;
  setPaymentMethodData: (paymentMethodData: IPaymentMethod) => void;
}

const FormPaymentMethod: React.FC<IForm> = ({
  handleShowForm,
  type,
  paymentMethodData,
  setPaymentMethodData,
}) => {
  const [typeForm, setTypeForm] = useState<"edit" | "detail">("detail");
  const [paymentGuide, setPaymentGuide] = useState<string>(
    paymentMethodData.paymentGuide || ""
  );

  let categ;
  switch (paymentMethodData?.category) {
    case "1":
      categ = "EWallet";
      break;
    case "2":
      categ = "QRIS";
      break;
    case "3":
      categ = "Virtual Account";
      break;
    case "4":
      categ = "Retail";
      break;
    default:
      categ = "N/A";
  }

  let strTime;
  switch (paymentMethodData?.durationCd) {
    case "s":
      strTime = "Detik";
      break;
    case "m":
      strTime = "Menit";
      break;
    case "h":
      strTime = "Jam";
      break;
    case "d":
      strTime = "Hari";
      break;
    case "M":
      strTime = "Bulan";
      break;
    case "y":
      strTime = "Tahun";
      break;
    default:
      strTime = "N/A";
      break;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/v1/payment/${paymentMethodData.id}`,
        {
          method: "PUT",
          cache: "no-cache",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentGuide: paymentGuide,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPaymentMethodData({ ...paymentMethodData, paymentGuide });

      toast.success("Berhasil menyimpan petunjuk pembayaran");
    } catch (error) {
      toast.error("Gagal menyimpan petunjuk pembayaran");
      console.error("Failed to post payment guide:", error);
    }
    setTypeForm("detail");
  };

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50 py-8">
      <div className="md:w-3/4 lg:w-2/5 md:max-h-full w-full bg-white p-8 rounded-xl overflow-y-auto relative">
        <div className="flex justify-between border-b-2 pb-4 border-gray-200 items-center">
          <h1 className="text-xl font-medium text-2xl text-neutral-800">
            Detail {paymentMethodData?.name}
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
        <form
          onSubmit={(e) => {
            handleFormSubmit(e);
          }}
        >
          <div className="w-full mt-4 gap-4">
            <label
              htmlFor="name"
              className="font-medium text-base text-neutral-900 inline-block"
            >
              Logo
            </label>
            <div className="w-[140px] aspect-square mt-4">
              <Image
                src={paymentMethodData?.logo || ""}
                alt={"Logo Metode Pembayaran"}
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", height: "100%" }}
                className="rounded-lg object-contain"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Nama
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  defaultValue={paymentMethodData?.name}
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="minAmount"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Minimal Pembelian
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="minAmount"
                  id="minAmount"
                  autoComplete="off"
                  defaultValue={formatter(paymentMethodData?.minAmount || 0)}
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="maxAmount"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Maximal Pembelian
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="maxAmount"
                  id="maxAmount"
                  autoComplete="off"
                  defaultValue={formatter(paymentMethodData?.maxAmount || 0)}
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="fee"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Fee
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="fee"
                  id="fee"
                  autoComplete="off"
                  defaultValue={
                    paymentMethodData?.feeType === FeeType.AMOUNT
                      ? formatter(paymentMethodData?.fee)
                      : paymentMethodData?.fee + " %"
                  }
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="category"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Kategori
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="category"
                  id="category"
                  autoComplete="off"
                  defaultValue={categ}
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="fee"
                className="font-medium text-base text-neutral-900 inline-block"
              >
                Status
              </label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="fee"
                  id="fee"
                  autoComplete="off"
                  defaultValue={
                    paymentMethodData?.isActive ? "Aktif" : "Tidak Aktif"
                  }
                  className={
                    "cursor-not-allowed bg-gray-100 border-none text-neutral-600 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
                  }
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-4 gap-4">
            <label
              htmlFor="duration"
              className="font-medium text-base text-neutral-900 inline-block"
            >
              Durasi Kadaluarsa
            </label>
            <div className="w-full mt-2">
              <input
                disabled={type === "detail"}
                required
                type="text"
                name="duration"
                id="duration"
                autoComplete="off"
                defaultValue={
                  paymentMethodData?.durationExpired + " " + strTime
                }
                className="cursor-not-allowed bg-gray-100 border-none text-neutral-60 w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden"
              />
            </div>
          </div>
          <div className="w-full mt-4">
            <label
              htmlFor="payment-guide"
              className="font-medium text-base text-neutral-900 inline-block"
            >
              Payment Guide
            </label>
            <Editor
              value={paymentGuide}
              setValue={function (value: string): void {
                setPaymentGuide(value);
              }}
              typeForm={typeForm}
            />
            <p className="text-neutral-600 text-xs mt-2">
              Note: gunakan heading 2 sebagai judul instruksi dan list sebagai
              isi instruksi pembayaran{" "}
            </p>
          </div>
          {typeForm === "edit" && (
            <div className="flex justify-end space-x-2 bg-white py-5">
              <button
                type="submit"
                className={
                  "bg-primary-900 hover:bg-red-600 text-white font-medium w-24 py-3 rounded-md transition-all"
                }
              >
                Simpan
              </button>
            </div>
          )}
        </form>
        {typeForm === "detail" && (
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
      </div>
    </div>
  );
};

export default FormPaymentMethod;
