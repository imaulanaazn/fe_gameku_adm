"use client";

import { layananState } from "@/atom/layananState";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRecoilState } from "recoil";

const FormSearch = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useRecoilState(layananState);

  const handleClickSearch = (e: any) => {
    e.preventDefault();
    setCategory({ ...category, search });
  };

  return (
    <form className="my-2 lg:my-5 w-full">
      <div>
        <div className="search-bar w-full relative">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari game"
            className="w-full py-2 px-3 text-sm border border-solid border-slate-400 rounded-md"
          />
          <button onClick={handleClickSearch} type="submit">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute bg-white p-2 top-1/2 right-2 -translate-y-1/2 text-lg text-slate-400 hover:text-primary-900"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormSearch;
