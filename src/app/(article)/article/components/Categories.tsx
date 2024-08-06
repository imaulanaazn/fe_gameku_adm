import sendRequest from "@/lib/baseApi";
import React from "react";

interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IListCategoryResponse {
  data: ICategory[];
  page: number;
  total: number;
  totalPage: number;
  order: string;
  sort: string;
  limit: number;
}

export default async function Categories() {
  const categoryResponse = await sendRequest<IListCategoryResponse>(
    "/v1/article-category"
  );
  const categories = categoryResponse.data.data;

  return (
    <div className="">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Kategori</h2>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug}>
            {/* <a
              href={`/article/${category.slug}`}
              className="text-sm font-medium text-gray-600 hover:underline"
            >
              {category.name}
            </a> */}
            <span className="text-sm font-medium text-gray-600 hover:underline">
              {category.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
