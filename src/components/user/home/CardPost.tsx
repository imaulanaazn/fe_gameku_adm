import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";

import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";

const CardBlog: React.FC<INewsPostProps> = ({ blog }) => {
  return (
    <Link
      href={
        !blog.isExternal
          ? "/posts/" + blog.slug
          : blog.externalUrl
          ? blog.externalUrl
          : "#"
      }
      key={blog.id}
      className="bg-slate-100 flex flex-col shadow-md transition-transform hover:scale-105 rounded-md "
    >
      <img
        src={blog.img}
        alt={blog.title}
        className="w-full sm:h-96 md:h-72 h-40 object-cover mb-4 rounded-md"
      />
      <div className="flex flex-col flex-grow  sm:mx-5 mx-2">
        <h2 className="sm:text-xl text-base font-semibold mb-2 overflow-hidden overflow-ellipsis">
          {blog.title}
        </h2>
      </div>
      <p className="text-gray-500 font-montserrat font-semibold mb-2 sm:mx-5 mx-2 text-xs">
        <FontAwesomeIcon
          icon={faCommentAlt}
          size="xs"
          className="text-[#B72025] mr-1"
        />
        {blog.totalComments} Komentar
      </p>
      <p className="text-gray-500 font-montserrat font-semibold mb-2 sm:mx-5 mx-2 text-xs">
        {dayjs(blog.publishDate).format("DD-MM-YYYY")}
      </p>
      <div className="sm:mx-5 mx-2 mb-5 py-3 sm:px-10 px-4 rounded-md text-xs text-white font-montserrat font-bold bg-[#B72025] inline-block w-fit">
        READ MORE
      </div>
    </Link>
  );
};

export default CardBlog;
