"use client";

import ReactPaginate from "react-paginate";

interface IPaginationProp {
    onPageChange: ({ selected }: { selected: number }) => void;
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

const Pagination: React.FC<IPaginationProp> = ({ page, limit, total, totalPage, onPageChange }) => {
    const handleChange = ({ selected }: { selected: number }) => {
        onPageChange({ selected });
    };

    return (
        <div className="flex items-center justify-between mt-3 px-5">
            <p className="text-sm font-montserrat">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} Results
            </p>
            <ReactPaginate
                key={1}
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={totalPage ? totalPage : 1}
                marginPagesDisplayed={3}
                pageRangeDisplayed={3}
                onPageChange={handleChange}
                forcePage={page - 1}
                containerClassName={"flex space-x-2 items-center"}
                pageLinkClassName="font-semibold rounded-md px-3 py-2"
                nextLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                previousLinkClassName="bg-white border-2 border-gray-400 text-gray-800 rounded-md px-3 py-2"
                activeClassName={"bg-[#B72025] text-white font-semibold rounded-md py-2"}
            />
        </div>
    );
};

export default Pagination;
