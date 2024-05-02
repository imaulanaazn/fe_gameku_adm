import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  faArrowRight,
  faBars,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminNavbar() {
  return (
    <nav className="flex flex-nowrap justify-start sticky top-0 right-0 bg-white z-40">
      <div className="navbar-inner flex w-full justify-between px-6 py-4">
        <Link href={"/"} className="hidden">
          <div className="logo">
            {/* <Image src="" width={40} height={40} alt="gasskeun logo" /> */}
          </div>
          <h4>Gasskeun Topup</h4>
        </Link>

        <div className="sidebar-toggle hidden">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>

        <div className="search-input w-auto h-max relative flex flex-wrap items-center">
          {/* <span className="absolute top-1/2 left-0 -translate-y-1/2 px-4 py-2">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-xl text-slate-400"
            />
          </span>
          <input
            type="search"
            placeholder="Search..."
            className="flex-1 px-4 placeholder:pl-10 rounded-md border"
          /> */}
        </div>

        <button className="navbar-toggler hidden">
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="navbar">
          <ul className="ml-auto">
            <li className="hidden">
              <a href="#">
                <FontAwesomeIcon icon={faBars} />
              </a>
              <div className="dropdown-menu">
                {/* implement dropwon menu for message here */}
              </div>
            </li>
            <li className="relative">
              <a href="#" className="flex items-center gap-4">
                <Image
                  src="/images/IconUser.png"
                  width={40}
                  height={40}
                  alt="user profile"
                />
                <div className="caption">
                  <h6 className="text-lg font-medium text-neutral-700">
                    Gasskeun Topup
                  </h6>
                  <p className="text-neutral-600">Admin</p>
                </div>
              </a>

              <div className="profile-dropdown absolute top-0 right-0 hidden">
                implement dropdown for user profile here
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
