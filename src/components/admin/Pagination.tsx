"use client";

import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ReactPaginate from "react-paginate";

interface IPaginationProp {
  onPageChange: ({ selected }: { selected: number }) => void;
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const Pagination: React.FC<IPaginationProp> = ({
  page,
  limit,
  total,
  totalPage,
  onPageChange,
}) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const handleChange = ({ selected }: { selected: number }) => {
    onPageChange({ selected });
    setActivePageIndex(selected);
  };
  const showingFrom = page === 1 ? 1 : (page - 1) * (limit + 1);

  const prevPaginationBtn =
    activePageIndex + 1 === 1
      ? "bg-slate-200 border-2 border-gray-200 rounded-md px-3 py-2 text-slate-400 cursor-not-allowed"
      : "bg-primary-100 border-2 border-primary-100 hover:border-primary-900 text-rose-700 rounded-md px-3 py-2 transition-all";
  const nextPaginationBtn =
    activePageIndex + 1 === totalPage
      ? "bg-slate-200 border-2 border-gray-200 rounded-md px-3 py-2 text-slate-400 cursor-not-allowed"
      : "bg-primary-100 border-2 border-primary-100 hover:border-primary-900 text-rose-700 rounded-md px-3 py-2 transition-all";

  return (
    <div className="flex flex-col-reverse items-center justify-between p-5 gap-4">
      <p className="text-sm font-montserrat">
        Showing {showingFrom} to {Math.min(page * limit, total)} of {total}{" "}
        results
      </p>

      <ReactPaginate
        previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
        nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
        breakLabel={"..."}
        pageCount={totalPage ? parseInt(totalPage.toString()) : 1}
        marginPagesDisplayed={3}
        pageRangeDisplayed={3}
        onPageChange={handleChange}
        forcePage={page - 1}
        containerClassName={"flex space-x-2 items-center"}
        pageLinkClassName="font-semibold rounded-md px-2 py-2"
        nextLinkClassName={nextPaginationBtn}
        previousLinkClassName={prevPaginationBtn}
        activeClassName={"bg-[#B72025] text-white font-semibold rounded-md p-2"}
      />
    </div>
  );
};

export default Pagination;
