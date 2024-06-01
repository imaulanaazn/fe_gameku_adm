"use client";

import React, { useEffect, useRef, useState } from "react";
import ChangeEmail from "./ChangeEmail";
import ChangeName from "./ChangeName";
import ChangePassword from "./ChangePassword";
import HistoryTopup from "./HistoryTopup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { userState } from "@/atom/userState";
import Loading from "@/app/(user)/(home)/components/loading";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDollarToSlot,
  faEdit,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Container from "../global/Container/Container";
import Link from "next/link";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const inputFile = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [user, setUser] = useRecoilState(userState);
  // const [activeComponent, setActiveComponent] = useState("HistoryTopup");

  // const renderComponent = () => {
  //   switch (activeComponent) {
  //     case "ChangeEmail":
  //       return <ChangeEmail />;
  //     case "ChangePassword":
  //       return <ChangePassword />;
  //     case "ChangeName":
  //       return <ChangeName />;
  //     case "HistoryTopup":
  //       return <HistoryTopup />;
  //     default:
  //       return null;
  //   }
  // };

  const getUser = async () => {
    setLoading(true);
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (!req.ok) {
      push("/login");
    } else {
      setUser(res);
    }
    setLoading(false);
  };

  // const handleLogout = async () => {
  //   const toastId = toast.loading("Memproses logout...");
  //   setLoading(true);
  //   const responseCustomer = await fetch(
  //     process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/logout",
  //     {
  //       method: "DELETE",
  //       credentials: "include",
  //       headers: {
  //         "ngrok-skip-browser-warning": "true",
  //       },
  //     }
  //   );

  //   if (responseCustomer.ok) {
  //     setUser({} as IUser);
  //     localStorage.setItem("auth", JSON.stringify({ login: false }));
  //     localStorage.removeItem("user");
  //     toast.update(toastId, {
  //       render: "Berhasil logout",
  //       type: "success",
  //       isLoading: false,
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //     push("/login");
  //   } else {
  //     const res = await responseCustomer.json();
  //     toast.update(toastId, {
  //       render: res.message,
  //       type: "error",
  //       isLoading: false,
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //   }
  //   setLoading(false);
  // };

  const uploadImage = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/customer/image?id=" + user.id,
      {
        cache: "no-cache",
        method: "PUT",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      }
    );

    const res = await req.json();
    if (req.ok) {
      setUser((prev) => ({
        ...prev,
        ...res,
      }));

      localStorage.setItem("user", JSON.stringify({ ...user, ...res }));
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleClick = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      {loading && <Loading />}

      {user && !loading && (
        <Container>
          <div className="mx-auto py-24 md:pt-24  h-fit min-h-screen text-center w-full lg:p-5 text-white flex flex-col items-center">
            <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-8 mb-10 md:mb-12">
              <div className="flex items-center gap-3 justify-between w-3/4 lg:w-full lg:flex-row flex-col bg-transparent lg:bg-gradient-to-tr from-rose-500 to-orange-300 lg:py-6 lg:px-6 rounded-xl">
                <div className="flex gap-3 lg:gap-5 lg:flex-row flex-col justify-center items-center">
                  <div
                    className="h-20 md:h-28 lg:h-14 aspect-square rounded-full bg-opacity-50 flex-shrink-0 relative group border-2 border-gray-400 lg:border-white"
                    onClick={handleClick}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        width={100}
                        height={100}
                        alt="user profile"
                        className="w-full h-full"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-1/2 h-1/2 text-slate-400 lg:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    )}
                    <div className="hidden group-hover:flex cursor-pointer bg-opacity-30 absolute top-0 left-0 bg-black w-full h-full z-50 aspect-square rounded-full justify-center items-center">
                      <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 text-white">
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </span>
                      <input
                        className=""
                        type="file"
                        name="imageLogoDenom"
                        id="imageLogoDenom"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        ref={inputFile}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="lg:text-start">
                    <h2 className="text-2xl md:text-2xl font-semibold lg:text-medium text-neutral-800 lg:mb-1 lg:text-white">
                      {user.name}
                    </h2>
                    <p className="text-sm md:text-base lg:text-sm text-neutral-600 lg:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile/edit"
                  className="text-primary-900 lg:text-white underline px-6 py-2 rounded-full cursor-pointer text-sm font-medium flex gap-2 items-center"
                >
                  Edit Profile
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
              </div>

              <div className="w-full bg-gradient-to-tr from-rose-500 to-orange-300 mx-auto rounded-lg md:rounded-xl flex items-center justify-between gap-4 py-4 px-6  md:py-6 md:px-8">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCircleDollarToSlot}
                      className="text-3xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-left mb-1">Saldomu</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-xl font-semibold">$123.000</p>
                      <p className="text-xs font-light">GCash</p>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-primary-900 py-1 px-2 md:py-2 md:px-4 rounded-md text-sm font-medium border hover:text-white hover:bg-transparent hover:border-white">
                  Topup
                </button>
              </div>
            </div>

            <HistoryTopup />
            {/* <div className="w-[90%] lg:w-full mb-10">
              <ul className="mt-5 w-full bg-gray-400 flex justify-center lg:flex-row flex-col">
                <li
                  className={`py-2 px-6 text-sm cursor-pointer ${
                    activeComponent === "HistoryTopup" && "bg-[#B72025]"
                  }`}
                  onClick={() => setActiveComponent("HistoryTopup")}
                >
                  History Top Up
                </li>
                <li
                  className={`py-2 px-6 text-sm cursor-pointer ${
                    activeComponent === "ChangeName" && "bg-[#B72025]"
                  }`}
                  onClick={() => setActiveComponent("ChangeName")}
                >
                  Ganti Nama
                </li>
                <li
                  className={`py-2 px-6 text-sm cursor-pointer ${
                    activeComponent === "ChangeEmail" && "bg-[#B72025]"
                  }`}
                  onClick={() => setActiveComponent("ChangeEmail")}
                >
                  Ganti Email
                </li>
                <li
                  className={`py-2 px-6 text-sm cursor-pointer ${
                    activeComponent === "ChangePassword" && "bg-[#B72025]"
                  }`}
                  onClick={() => setActiveComponent("ChangePassword")}
                >
                  Atur Ulang Password
                </li>
              </ul>
            </div>
            {renderComponent()} */}
          </div>
        </Container>
      )}
    </>
  );
};

export default Profile;
