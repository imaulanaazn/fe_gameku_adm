import {
  faCalendarDays,
  faClock,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <div className="w-full py-6 bg-white shadow">
        <div className="md:w-11/12 lg:-9/12 mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Manage Your Blogs</h1>
          <form id="search_form" name="gs" method="GET" action="#">
            <input
              type="text"
              name="q"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search blog.."
            />
            <input type="button" />
          </form>
        </div>
      </div>
      <div className="flex gap-6 mt-6">
        <div className="w-full flex flex-col gap-6">
          {/* <div className="md:w-11/12 lg:w-9/12 mx-auto p-1 rounded-xl shadow hover:shadow-lg transform transition duration-300">
            <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-lg w-24 h-24 md:w-32 md:h-32"></div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <p className="text-sm text-primary-900 font-medium">Category</p>
                <h3 className="text-xl font-bold text-gray-900">
                  Lorem Ipsum Dolor2
                </h3>
                <div className="flex items-center justify-between">
                  <p className="mt-2 text-gray-600 w-3/4">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae voluptate repellendus magni illo ea animi?
                  </p>
                  <div className="flex shrink-0 gap-4 items-center">
                    <Image
                      src={"/images/IconUser.png"}
                      width={30}
                      height={30}
                      alt="profile"
                    />
                    <span>Author name</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <ul className="flex space-x-4 text-sm text-gray-500">
                    <li>Admin</li>
                    <li>|</li>
                    <li>May 12, 2020</li>
                    <li>|</li>
                    <li>10 Comments</li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <Link href="/edit">
                      <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                        Edit
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                    </Link>
                    <button>
                      <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                        Delete
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="md:w-11/12 xl:w-9/12 mx-auto p-1 rounded-xl shadow hover:shadow-lg transform transition duration-300">
            <div className="bg-white rounded-xl p-6 md:p-6 flex flex-col md:flex-row items-center">
              <div className="w-full md:w-max flex-shrink-0">
                <div className="w-full md:w-max">
                  <Image
                    src={"/images/blog-thumb-01.jpg"}
                    width={400}
                    height={300}
                    alt="blog thumbnail"
                    className="w-full md:w-32 height-auto aspect-video md:aspect-square md:rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <p className="text-sm text-primary-900 font-medium">Category</p>
                <h3 className="text-xl font-bold text-gray-900">
                  Lorem Ipsum Dolor2
                </h3>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <p className="mt-2 text-gray-600 w-full md:w-3/4">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae voluptate repellendus magni illo ea animi?
                  </p>
                  <div className="flex md:flex-col lg:flex-row shrink-0 gap-2 lg:gap-4 items-center">
                    <Image
                      src={"/images/IconUser.png"}
                      width={30}
                      height={30}
                      alt="profile"
                    />
                    <span>Author name</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <ul className="flex gap-x-4 text-sm text-gray-500">
                    <li>Admin</li>
                    <li>|</li>
                    <li>May 12, 2020</li>
                    <li>|</li>
                    <li>10 Comments</li>
                  </ul>
                  {/* <button className="inline-block px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition duration-300">
                Read More
              </button> */}
                  <div className="flex items-center gap-4">
                    <Link href="/edit/:blogId">
                      <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                        Edit
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                    </Link>
                    <button>
                      <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                        Delete
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
