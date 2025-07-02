"use client";

import { layananState } from "@/atom/layananState";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

interface IDataProps {
  data: {
    id: string;
    name: string;
  };
}

const ListCategory: React.FC<IDataProps> = ({ data }) => {
  const [category, setCategory] = useRecoilState(layananState);

  return (
    // <a href="#layanan">
    <div
      onClick={() => setCategory({ ...category, id: data.id, search: "" })}
      className={`${
        category.id === data.id
          ? "bg-primary-900 text-white font-medium"
          : "border border-white/70 text-white/70"
      } px-5 py-2.5 rounded-full md:text-sm cursor-pointer text-xs w-max shrink-0`}
    >
      {data.name}
    </div>
    // </a>
  );
};

export default ListCategory;
