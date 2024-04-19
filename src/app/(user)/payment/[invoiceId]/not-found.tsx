import { Metadata } from "next";
import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-100  h-screen">
      <h1 className="text-4xl text-[#B72025]">404</h1>
      <h1 className="text-4xl text-[#B72025]">Page Not Found</h1>
      <p className="text-lg text-gray-700 mt-2">
        Sorry, there is nothing to see here
      </p>
      <p className="text-lg text-gray-700 mt-2">
        Please double-check the URL or navigate back to the homepage.
      </p>
      <div className="mt-6">
        <Link href="/" className="text-white bg-[#B72025] py-4 px-6 rounded-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export const generateMetadata = () => {
  return {
    title: "Page Tidak Ditemukan",
  } as Metadata;
};

export default NotFound;
