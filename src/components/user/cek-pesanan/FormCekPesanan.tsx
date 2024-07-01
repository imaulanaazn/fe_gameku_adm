"use client";

import { userOrderHistoryState } from "@/atom/userOrderHistory";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import validator from "validator";

const FormCekPesanan = () => {
  const [trxNo, setTrxNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [isMobileNo, setIsMobileNo] = useState(false);
  const [orderHistory, setOrderHistory] = useRecoilState(userOrderHistoryState);

  const getOrderHistory = async () => {
    setLoading(true);
    const toastId = toast.loading("Mengecek riwayat transaksi");
    const querySearch = (isMobileNo ? "mobileNumber=" : "invoice=") + trxNo;
    const result = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-history?" + querySearch,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    const res = await result.json();
    if (result.ok) {
      setOrderHistory({ keySearch: querySearch, ...res });
      toast.update(toastId, {
        render: "Berhasil mendapatkan riwayat transaksi",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render:
          "Kesalahan dalam mengambil riwayat transaksi, silahkan coba lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    getOrderHistory();
  };

  useEffect(() => {
    if (!trxNo) {
      setAllowed(false);
    } else {
      setAllowed(true);

      const convertedNumber = trxNo.replace(/^(\+62|62|0)?(\d+)/, "0$2");
      const mobileNo = validator.isMobilePhone(convertedNumber, "id-ID");
      if (mobileNo) {
        setIsMobileNo(true);
      } else {
        setIsMobileNo(false);
      }
    }
  }, [trxNo]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto text-xs text-black flex flex-col md:flex-row gap-4 mt-8"
    >
      <input
        type="text"
        id="text"
        className="w-full md:text-base lg:text-sm rounded-md py-2 px-4 md:py-4 md:px-6 lg:py-3 lg:px-5"
        value={trxNo}
        onChange={(e) => setTrxNo(e.target.value)}
        required
        placeholder="kode transaksi / No Whatsapp"
      />
      {loading ? (
        <button className="w-full md:w-max shrink-0 bg-neutral-400 text-white cursor-not-allowed rounded-md py-2 px-4 lg:px-5 cursor-wait">
          <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse />
        </button>
      ) : allowed ? (
        <button
          type="submit"
          className={`w-full md:w-max shrink-0 bg-black text-white text-base lg:text-sm rounded-md py-2 px-4 lg:px-5 font-medium hover:bg-black hover:text-white`}
        >
          Cek Pesanan
        </button>
      ) : (
        <button
          disabled
          className="w-full md:w-max shrink-0 bg-neutral-400 text-white cursor-not-allowed text-base lg:text-sm rounded-md py-2 px-4 lg:px-5 font-medium"
        >
          Cek Pesanan
        </button>
      )}
    </form>
  );
};

export default FormCekPesanan;
