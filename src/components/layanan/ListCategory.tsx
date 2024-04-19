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
    <div>
      <div
        onClick={() => setCategory({ ...category, id: data.id, search: "" })}
        className={`${
          category.id === data.id
            ? "bg-[#B72025] text-white"
            : "bg-[#eeeeee] text-neutral-800"
        } px-5 py-2 rounded-md  md:text-sm cursor-pointer text-xs font-medium`}
      >
        {data.name}
      </div>
    </div>
  );
};

export default ListCategory;
