import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

function NotFound() {
  return (
    <section className="bg-white flex items-center justify-center">
      <div className="container min-h-screen px-6 md:px-12 py-12 mx-auto flex flex-col items-center justify-center lg:flex-row lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-medium text-primary-900 ">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800  md:text-3xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-4 text-gray-500 ">
            Mohon maaf, halaman yang kamu cari tidak tersedia. berikut link yang
            mungkin berguna :
          </p>

          <div className="flex items-center mt-6 gap-x-3 text-center">
            <Link
              href="/"
              className="w-1/2 px-5 py-3 text-sm tracking-wide text-white transition-colors duration-200 bg-primary-900 rounded-md shrink-0 sm:w-auto hover:bg-red-600 "
            >
              Ke Beranda
            </Link>
          </div>
        </div>

        <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0 flex">
          <Image
            width={300}
            height={100}
            className="w-full max-w-lg lg:mx-auto"
            src="https://merakiui.com/images/components/illustration.svg"
            alt="404 not found image"
          />
        </div>
      </div>
    </section>
  );
}

export const generateMetadata = () => {
  return {
    title: "Page Tidak Ditemukan",
  } as Metadata;
};

export default NotFound;
