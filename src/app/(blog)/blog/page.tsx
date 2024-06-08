"use client";
import { faCalendarDays, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const carouselBreakpoints = {
  0: {
    slidesPerView: 1,
  },
  640: {
    slidesPerView: 1.25,
  },
  768: {
    slidesPerView: 1.5,
  },
  1024: {
    slidesPerView: 2.5,
  },
  1280: {
    slidesPerView: 3,
  },
};

export default function page() {
  return (
    <>
      <section className="px-4 md:px-0">
        <Swiper
          spaceBetween={28}
          slidesPerView={1}
          centeredSlides={true}
          breakpoints={carouselBreakpoints}
          freeMode={true}
          className="flex items-center"
        >
          <SwiperSlide>
            <div className="bg-white shadow-md overflow-hidden relative">
              <img
                src="/images/banner-item-01.jpg"
                alt=""
                className="w-full h-auto aspect-video"
              />
              <div className="p-6 absolute bottom-0 left-0 bg-gradient-to-t from-slate-900 to-[rgba(0,0,0,0)] w-full">
                <div className="">
                  <div className="text-sm font-medium text-white">
                    <span className="text-white">Fashion</span>
                  </div>
                  <a href="post-details.html" className="block mt-2">
                    <h4 className="text-xl font-bold text-white hover:underline">
                      Morbi dapibus condimentum
                    </h4>
                  </a>
                  <ul className="flex space-x-4 text-sm text-white mt-4">
                    <li>
                      <a href="#" className="hover:underline">
                        Admin
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        May 12, 2020
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        12 Comments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white shadow-md overflow-hidden">
              <img
                src="/images/banner-item-02.jpg"
                alt=""
                className="w-full h-auto aspect-video"
              />
              <div className="p-6 absolute bottom-0 left-0 bg-gradient-to-t from-slate-900 to-[rgba(0,0,0,0)] w-full">
                <div className="">
                  <div className="text-sm font-medium text-white">
                    <span className="text-white">Fashion</span>
                  </div>
                  <a href="post-details.html" className="block mt-2">
                    <h4 className="text-xl font-bold text-white hover:underline">
                      Morbi dapibus condimentum
                    </h4>
                  </a>
                  <ul className="flex space-x-4 text-sm text-white mt-4">
                    <li>
                      <a href="#" className="hover:underline">
                        Admin
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        May 12, 2020
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        12 Comments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white shadow-md overflow-hidden">
              <img
                src="/images/banner-item-03.jpg"
                alt=""
                className="w-full h-auto aspect-video"
              />
              <div className="p-6 absolute bottom-0 left-0 bg-gradient-to-t from-slate-900 to-[rgba(0,0,0,0)] w-full">
                <div className="">
                  <div className="text-sm font-medium text-white">
                    <span className="text-white">Fashion</span>
                  </div>
                  <a href="post-details.html" className="block mt-2">
                    <h4 className="text-xl font-bold text-white hover:underline">
                      Morbi dapibus condimentum
                    </h4>
                  </a>
                  <ul className="flex space-x-4 text-sm text-white mt-4">
                    <li>
                      <a href="#" className="hover:underline">
                        Admin
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        May 12, 2020
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        12 Comments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white shadow-md overflow-hidden">
              <img
                src="/images/banner-item-04.jpg"
                alt=""
                className="w-full h-auto aspect-video"
              />
              <div className="p-6 absolute bottom-0 left-0 bg-gradient-to-t from-slate-900 to-[rgba(0,0,0,0)] w-full">
                <div className="">
                  <div className="text-sm font-medium text-white">
                    <span className="text-white">Fashion</span>
                  </div>
                  <a href="post-details.html" className="block mt-2">
                    <h4 className="text-xl font-bold text-white hover:underline">
                      Morbi dapibus condimentum
                    </h4>
                  </a>
                  <ul className="flex space-x-4 text-sm text-white mt-4">
                    <li>
                      <a href="#" className="hover:underline">
                        Admin
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        May 12, 2020
                      </a>
                    </li>
                    <li>|</li>
                    <li>
                      <a href="#" className="hover:underline">
                        12 Comments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="bg-gray-50 py-12 px-4 md:px-0">
        <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
          <div className="text-center">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-[url('/images/cta-bg.jpg')] py-12 md:py-10 lg:py-12 px-8 xl:px-12">
              <div className="w-full md:w-2/3">
                <p className="text-base font-medium text-white text-center lg:text-left">
                  Stand Blog HTML5 Template
                </p>
                <h4 className="text-2xl font-bold text-white text-center lg:text-left mt-2">
                  Creative HTML Template For Bloggers!
                </h4>
              </div>
              <div className="w-full lg:w-1/3 text-center lg:text-right">
                <a
                  href="https://templatemo.com/tm-551-stand-blog"
                  className="inline-block px-6 py-2 bg-primary-900 text-white font-medium"
                  target="_parent"
                >
                  Top Up Sekarang!!
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 px-4 md:px-0">
        <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-2/3 px-4">
              <div className="space-y-8">
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full md:w-1/2 px-4 mb-8">
                    <div className="mb-6">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={400}
                        height={400}
                        alt="blog post"
                        objectFit="cover"
                        className="w-full h-auto aspect-video"
                      />
                    </div>
                    <div>
                      <span className="block text-base font-semibold text-primary-900">
                        Lifestyle
                      </span>
                      <a
                        href="post-details.html"
                        className="block text-lg font-bold text-gray-800 hover:underline mt-2"
                      >
                        Donec tincidunt leo
                      </a>
                      <ul className="flex space-x-2 text-sm text-gray-500 mt-2">
                        <li>
                          <a href="#" className="hover:underline">
                            Admin
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="w-3"
                            />
                            May 31, 2020
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faClock} className="w-3" />
                            12 minutes
                          </a>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-600 my-5">
                        Nullam nibh mi, tincidunt sed sapien ut, rutrum
                        hendrerit velit. Integer auctor a mauris sit amet
                        eleifend.
                      </p>
                      <div className="mt-4">
                        <ul className="flex space-x-2 text-sm text-gray-500">
                          <li>
                            <a href="#" className="hover:underline">
                              12 comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-8">
                    <div className="mb-6">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={400}
                        height={400}
                        alt="blog post"
                        objectFit="cover"
                        className="w-full h-auto aspect-video"
                      />
                    </div>
                    <div>
                      <span className="block text-base font-semibold text-primary-900">
                        Lifestyle
                      </span>
                      <a
                        href="post-details.html"
                        className="block text-lg font-bold text-gray-800 hover:underline mt-2"
                      >
                        Donec tincidunt leo
                      </a>
                      <ul className="flex space-x-2 text-sm text-gray-500 mt-2">
                        <li>
                          <a href="#" className="hover:underline">
                            Admin
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="w-3"
                            />
                            May 31, 2020
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faClock} className="w-3" />
                            12 minutes
                          </a>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-600 my-5">
                        Nullam nibh mi, tincidunt sed sapien ut, rutrum
                        hendrerit velit. Integer auctor a mauris sit amet
                        eleifend.
                      </p>
                      <div className="mt-4">
                        <ul className="flex space-x-2 text-sm text-gray-500">
                          <li>
                            <a href="#" className="hover:underline">
                              12 comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-8">
                    <div className="mb-6">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={400}
                        height={400}
                        alt="blog post"
                        objectFit="cover"
                        className="w-full h-auto aspect-video"
                      />
                    </div>
                    <div>
                      <span className="block text-base font-semibold text-primary-900">
                        Lifestyle
                      </span>
                      <a
                        href="post-details.html"
                        className="block text-lg font-bold text-gray-800 hover:underline mt-2"
                      >
                        Donec tincidunt leo
                      </a>
                      <ul className="flex space-x-2 text-sm text-gray-500 mt-2">
                        <li>
                          <a href="#" className="hover:underline">
                            Admin
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="w-3"
                            />
                            May 31, 2020
                          </a>
                        </li>
                        <li className="text-gray-400">|</li>
                        <li>
                          <a
                            href="#"
                            className="hover:underline flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faClock} className="w-3" />
                            12 minutes
                          </a>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-600 my-5">
                        Nullam nibh mi, tincidunt sed sapien ut, rutrum
                        hendrerit velit. Integer auctor a mauris sit amet
                        eleifend.
                      </p>
                      <div className="mt-4">
                        <ul className="flex space-x-2 text-sm text-gray-500">
                          <li>
                            <a href="#" className="hover:underline">
                              12 comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 px-4 md:px-0 lg:pl-8">
              <div className="space-y-8">
                <div className="">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Recent Posts
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    <li>
                      <a href="post-details.html" className="block">
                        <h5 className="text-base font-semibold text-gray-700">
                          Vestibulum id turpis porttitor sapien facilisis
                          scelerisque
                        </h5>
                        <ul className="flex space-x-2 text-xs text-gray-500 mt-2">
                          <li>
                            <a href="#" className="hover:underline">
                              Admin
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="w-3"
                              />
                              May 31, 2020
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faClock} className="w-3" />
                              12 minutes
                            </a>
                          </li>
                        </ul>
                      </a>
                    </li>
                    <li className="w-full h-px bg-slate-200"></li>
                    <li>
                      <a href="post-details.html" className="block">
                        <h5 className="text-base font-semibold text-gray-700">
                          Suspendisse et metus nec libero ultrices varius eget
                          in risus
                        </h5>
                        <ul className="flex space-x-2 text-xs text-gray-500 mt-2">
                          <li>
                            <a href="#" className="hover:underline">
                              Admin
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="w-3"
                              />
                              May 31, 2020
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faClock} className="w-3" />
                              12 minutes
                            </a>
                          </li>
                        </ul>
                      </a>
                    </li>
                    <li className="w-full h-px bg-slate-200"></li>
                    <li>
                      <a href="post-details.html" className="block">
                        <h5 className="text-base font-semibold text-gray-700">
                          Swag hella echo park leggings, shaman cornhole ethical
                          coloring
                        </h5>
                        <ul className="flex space-x-2 text-xs text-gray-500 mt-2">
                          <li>
                            <a href="#" className="hover:underline">
                              Admin
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="w-3"
                              />
                              May 31, 2020
                            </a>
                          </li>
                          <li className="text-gray-400">|</li>
                          <li>
                            <a
                              href="#"
                              className="hover:underline flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faClock} className="w-3" />
                              12 minutes
                            </a>
                          </li>
                        </ul>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Categories
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - Nature Lifestyle
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - Awesome Layouts
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - Creative Ideas
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - Responsive Templates
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - HTML5 / CSS3 Templates
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        - Creative &amp; Unique
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Promo Top Up
                    </h2>
                  </div>
                  <ul className="flex flex-wrap gap-3">
                    <li className="p-3 flex gap-2 items-center border border-slate-300 rounded">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={30}
                        height={30}
                        alt="game image"
                        className="rounded"
                      />
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        Lifestyle
                      </a>
                    </li>
                    <li className="p-3 flex gap-2 items-center border border-slate-300 rounded">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={30}
                        height={30}
                        alt="game image"
                        className="rounded"
                      />
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        Mobile Legend
                      </a>
                    </li>
                    <li className="p-3 flex gap-2 items-center border border-slate-300 rounded">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={30}
                        height={30}
                        alt="game image"
                        className="rounded"
                      />
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        Valorant
                      </a>
                    </li>
                    <li className="p-3 flex gap-2 items-center border border-slate-300 rounded">
                      <Image
                        src="/images/blog-thumb-01.jpg"
                        width={35}
                        height={35}
                        alt="game image"
                        className="rounded"
                      />
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        PUBG Mobile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
