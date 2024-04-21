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
    <div
      onClick={() => setCategory({ ...category, id: data.id, search: "" })}
      className={`${
        category.id === data.id
          ? "bg-primary-900 text-white"
          : "bg-white text-neutral-700"
      } px-5 py-2 rounded-md md:text-sm cursor-pointer text-xs font-medium w-max shrink-0`}
    >
      {data.name}
    </div>
  );
};

export default ListCategory;
