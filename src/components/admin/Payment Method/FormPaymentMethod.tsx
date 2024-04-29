"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
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
registerLocale("id", id);

interface IForm {
  handleShowForm: (defaultValue: boolean) => void;
  type: string;
  data: IPaymentMethod;
}

const FormPaymentMethod: React.FC<IForm> = ({ handleShowForm, type, data }) => {
  let categ;
  switch (data.category) {
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
  switch (data.durationCd) {
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

  return (
    <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10">
      <div className="md:w-3/4 md:max-h-full w-full bg-white shadow p-4 rounded overflow-y-auto relative">
        <div className="flex justify-between border-b-2 py-2 border-gray-300 items-center">
          <h1 className="text-xl">Detail {data?.name}</h1>
          <div
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
            onClick={() => handleShowForm(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <form>
          <div className="w-full mt-3 gap-3">
            <label htmlFor="name">Logo</label>
            <div className="w-[150px] aspect-square mt-3">
              <Image
                src={data.logo}
                alt={"Logo Metode Pembayaran"}
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", height: "100%" }}
                className="rounded-lg object-contain"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <div className="w-1/2">
              <label htmlFor="name">Nama</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  defaultValue={data.name}
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="minAmount">Minimal Pembelian</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="minAmount"
                  id="minAmount"
                  autoComplete="off"
                  defaultValue={formatter(data.minAmount)}
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <div className="w-1/2">
              <label htmlFor="maxAmount">Maximal Pembelian</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="maxAmount"
                  id="maxAmount"
                  autoComplete="off"
                  defaultValue={formatter(data.maxAmount)}
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="fee">Fee</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="fee"
                  id="fee"
                  autoComplete="off"
                  defaultValue={
                    data.feeType === FeeType.AMOUNT
                      ? formatter(data.fee)
                      : data.fee + " %"
                  }
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <div className="w-1/2">
              <label htmlFor="category">Kategory</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="category"
                  id="category"
                  autoComplete="off"
                  defaultValue={categ}
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="fee">Status</label>
              <div className="w-full mt-2">
                <input
                  disabled={type === "detail"}
                  required
                  type="text"
                  name="fee"
                  id="fee"
                  autoComplete="off"
                  defaultValue={data.isActive ? "Aktif" : "Tidak Aktif"}
                  className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-3 gap-3">
            <label htmlFor="duration">Durasi Kadaluarsa</label>
            <div className="w-full mt-2">
              <input
                disabled={type === "detail"}
                required
                type="text"
                name="duration"
                id="duration"
                autoComplete="off"
                defaultValue={data.durationExpired + " " + strTime}
                className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPaymentMethod;
