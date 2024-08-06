"use client";

import React, { useEffect, useRef, useState } from "react";
import HistoryTopup from "./HistoryTopup";
import Loading from "@/app/(user)/(home)/components/loading";
import Image from "next/image";
import Link from "next/link";
import HistoryDeposit from "./HistoryDeposit";

const formatter = (data: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data);
};

const fetchData = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const inputFile = useRef(null);
  const [logo, setLogo] = useState("");
  const [userFund, setUserFund] = useState({
    name: "Gasskeun Coin",
    value: 0,
  });

  const getUserBalance = async () => {
    setLoading(true);
    const balanceData = await fetchData(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/user/balance`
    );

    if (balanceData) {
      setUserFund({ name: balanceData.name, value: balanceData.value });
    }
    setLoading(false);
  };

  const getLogo = async () => {
    const logoData = await fetchData(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/config?type=logo`
    );

    if (logoData) {
      setLogo(logoData[0].value);
    }
  };

  useEffect(() => {
    getUserBalance();
    getLogo();
  }, []);

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <div className="mx-auto py-0 lg:py-24 md:pt-12 lg:pt-24  h-fit min-h-screen text-center w-full lg:p-5 text-white flex flex-col items-center">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-8 mb-10 md:mb-12">
            <div className="w-full bg-gradient-to-tr from-rose-500 to-orange-300 mx-auto rounded-lg md:rounded-xl flex items-center justify-between gap-4 py-4 px-6  md:py-6 md:px-8">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center">
                  <Image
                    src={logo}
                    height={40}
                    width={40}
                    alt={"gasskeun logo"}
                  />
                </div>
                <div>
                  <p className="text-sm text-left mb-1">Saldomu</p>
                  <div className="flex flex-col lg:flex-row lg:gap-2 items-start lg:items-center">
                    <p className="text-xl font-semibold">
                      ${formatter(userFund.value || 0)}
                    </p>
                    <p className="text-xs font-light">{userFund.name}</p>
                  </div>
                </div>
              </div>
              <Link
                href="/profile/deposit"
                className="bg-white text-primary-900 py-1 px-2 md:py-2 md:px-4 rounded-md text-sm font-medium border hover:text-white hover:bg-transparent hover:border-white"
              >
                Topup
              </Link>
            </div>
          </div>

          <HistoryTopup />
          <div className="mt-8"></div>
          <HistoryDeposit />
        </div>
      )}
    </>
  );
};

export default Dashboard;
