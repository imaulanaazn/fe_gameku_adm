import { faChevronRight, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const articleStatus = ["PUBLISH", "ARCHIVE", "DRAFT"];

interface IFilterSidebar {
  filter: {
    isPopular: boolean;
    status: string;
  };
  closeFilterSidebar: () => void;
  handleFilter: (filter: { isPopular: boolean; status: string }) => void;
}

export default function FilterSidebar({
  filter,
  closeFilterSidebar,
  handleFilter,
}: IFilterSidebar) {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <span className="text-lg text-gray-600">Search Filter</span>
        <button
          onClick={closeFilterSidebar}
          className="w-8 h-8 rounded-full bg-slate-200 text-gray-600 hover:bg-primary-900 hover:text-white flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div>
        <span className="text-gray-500 text-base">Popularity</span>
        <div className="flex gap-2 items-center mt-2 ml-4">
          <input
            type="checkbox"
            id="isPopular"
            className="rounded text-primary-900 border-primary-900 focus:ring-primary-900"
            checked={filter.isPopular}
            onChange={(e) => {
              handleFilter({ ...filter, isPopular: e.target.checked });
            }}
          />
          <label htmlFor="isPopular" className="text-gray-500 text-sm">
            Artikel Populer
          </label>
        </div>
      </div>
      <div>
        <span className="text-gray-500 text-base">Artikel Status</span>
        <div className="flex flex-wrap mt-2 ml-4 gap-2">
          {articleStatus.map((status: string) => (
            <button
              onClick={() => {
                handleFilter({ ...filter, status: status });
              }}
              key={status}
              className={`py-2 px-4 rounded-full border text-xs  ${
                filter.status === status
                  ? "bg-primary-900 text-white"
                  : "border-primary-900 text-primary-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          handleFilter({ isPopular: false, status: "" });
        }}
        className="filter-btn py-2 px-4 bg-primary-900 text-white rounded-md border border-primary-900 mt-4"
      >
        <span>Clear Filter</span>
      </button>
    </div>
  );
}
