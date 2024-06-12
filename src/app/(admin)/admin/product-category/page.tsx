"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/global/loading/CompLoading";
import TableCategoryProduct from "@/components/admin/product-category/TableCategoryProduct";

const Denom = () => {
  const [productCategory, setProductCategory] =
    useState<IProductCategoryPagination>();
  const [loading, setLoading] = useState(true);
  const getProductCategories = async () => {
    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/product-category",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await req.json();
    if (req.ok) {
      setProductCategory({ ...productCategory, ...res });
    }

    setLoading(false);
  };

  useEffect(() => {
    getProductCategories();
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          {productCategory && (
            <TableCategoryProduct productCategory={productCategory} />
          )}
        </>
      )}
    </>
  );
};

export default Denom;
