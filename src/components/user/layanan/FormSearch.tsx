"use client";

import { layananState } from "@/atom/layananState";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRecoilState } from "recoil";

const FormSearch = () => {
  const [category, setCategory] = useRecoilState(layananState);

  return (
    <form className="my-2 w-full">
      <div className="search-bar w-full relative group">
        <input
          type="text"
          onChange={(e) => setCategory({ ...category, search: e.target.value })}
          placeholder="Cari game"
          className="w-full py-2 px-3 text-sm text-primary-900 placeholder:text-primary-900 border border-solid rounded-md focus:ring-0 focus:border-primary-900 border-primary-900 bg-transparent"
        />
        <a href="#layanan">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute bg-[#eaeaeea]] p-2 pr-4 top-1/2 right-1 -translate-y-1/2 text-lg text-primary-900"
          />
        </a>
      </div>
    </form>
  );
};

export default FormSearch;
