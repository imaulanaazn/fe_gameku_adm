import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function page() {
  return (
    <div>
      <div className="w-10/12 mx-auto p-1 rounded-xl shadow-md hover:shadow-lg transform transition duration-300">
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-lg w-24 h-24 md:w-32 md:h-32"></div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <p className="text-sm text-primary-900 font-medium">Category</p>
            <h3 className="text-xl font-bold text-gray-900">
              Lorem Ipsum Dolor2
            </h3>
            <p className="mt-2 text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Recusandae voluptate repellendus magni illo ea animi?
            </p>
            <div className="mt-4 flex items-center justify-between">
              <ul className="flex space-x-4 text-sm text-gray-500">
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
                <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                  Edit
                  <FontAwesomeIcon icon={faEdit} />
                </span>
                <span className="flex items-center gap-2 hover:text-primary-900 transition-all text-gray-500">
                  Delete
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
