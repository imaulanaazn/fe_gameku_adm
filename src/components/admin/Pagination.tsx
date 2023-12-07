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
    const showingFrom = page === 1 ? 1 : (page - 1) * (limit + 1);

    return (
        <div className="flex items-center justify-between p-5">
            <p className="text-sm font-montserrat">
                Showing {showingFrom} to {Math.min(page * limit, total)} of {total} results per page {limit}
            </p>

            <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={totalPage ? parseInt(totalPage.toString()) : 1}
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
