import {
  faFacebook,
  faFacebookF,
  faLinkedin,
  faTelegram,
  faTwitter,
  faWhatsapp,
  faWhatsappSquare,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faClock,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEnvelopeSquare,
  faShare,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <section className="pb-12 px-4 md:px-0 pt-4 md:pt-6 lg:pt-12">
      <div className="w-full md:w-10/12 lg:w-11/12 xl:w-9/12 mx-auto">
        <div className="flex flex-wrap gap-12 md:gap-0">
          <div className="w-full lg:w-2/3 px-0  md:px-4">
            <div className="space-y-8">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="pb-6">
                  <span className="block text-base font-semibold text-primary-900">
                    Lifestyle
                  </span>
                  <a href="post-details.html" className="block mt-2">
                    <h4 className="text-3xl md:text-4xl font-extrabold  text-gray-800 hover:underline">
                      Aenean pulvinar gravida sem nec
                    </h4>
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
                </div>
                <div className="relative">
                  <img
                    src="/images/blog-post-02.jpg"
                    alt=""
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-6">
                  <p className="mt-4 text-sm text-gray-600">
                    You can browse different tags such as{" "}
                    <a
                      rel="nofollow"
                      href="https://templatemo.com/tag/multi-page"
                      target="_parent"
                      className="text-blue-500 hover:underline"
                    >
                      multi-page
                    </a>
                    ,{" "}
                    <a
                      rel="nofollow"
                      href="https://templatemo.com/tag/resume"
                      target="_parent"
                      className="text-blue-500 hover:underline"
                    >
                      resume
                    </a>
                    ,{" "}
                    <a
                      rel="nofollow"
                      href="https://templatemo.com/tag/video"
                      target="_parent"
                      className="text-blue-500 hover:underline"
                    >
                      video
                    </a>
                    , etc. to see more CSS templates. Sed hendrerit rutrum arcu,
                    non malesuada nisi. Sed id facilisis turpis. Donec justo
                    elit, dapibus vel ultricies in, molestie sit amet risus. In
                    nunc augue, rhoncus sed libero et, tincidunt tempor nisl.
                    Donec egestas, quam eu rutrum ultrices, sapien ante posuere
                    nisl, ac eleifend eros orci vel ante. Pellentesque vitae
                    eleifend velit. Etiam blandit felis sollicitudin vestibulum
                    feugiat.
                    <br />
                    <br />
                    Donec tincidunt leo nec magna gravida varius. Suspendisse
                    felis orci, egestas ac sodales quis, venenatis et neque.
                    Vivamus facilisis dignissim arcu et blandit. Maecenas
                    finibus dui non pulvinar lacinia. Ut lacinia finibus lorem
                    vel porttitor. Suspendisse et metus nec libero ultrices
                    varius eget in risus. Cras id nibh at erat pulvinar
                    malesuada et non ipsum. Suspendisse id ipsum leo.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-sm text-gray-500">
                <ul className="flex space-x-2 text-primary-900">
                  <li className="font-medium">Share Stories</li>
                </ul>
                <ul className="flex gap-2 items-center">
                  <li className="text-primary-900 flex items-center gap-2 hidden md:block">
                    <FontAwesomeIcon icon={faShareNodes} className="text-xl" />
                  </li>
                  <li className="w-8 h-8 bg-blue-600 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-green-600 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faWhatsappSquare} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-700 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-400 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faTelegram} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-blue-400 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </li>
                  <li className="w-8 h-8 bg-gray-400 text-white rounded-full">
                    <a
                      href="#"
                      className="hover:underline w-full h-full flex items-center justify-center text-lg text-white"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-white overflow-hidden">
                <div className="py-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    4 comments
                  </h2>
                  <ul className="mt-6 space-y-4">
                    <li className="flex">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src="assets/images/comment-author-01.jpg"
                          alt=""
                          className="w-full h-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-bold text-gray-700">
                          Charles Kate
                          <span className="block text-xs font-normal text-gray-500">
                            May 16, 2020
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">
                          Fusce ornare mollis eros. Duis et diam vitae justo
                          fringilla condimentum eu quis leo. Vestibulum id
                          turpis porttitor sapien facilisis scelerisque.
                          Curabitur a nisl eu lacus convallis eleifend posuere
                          id tellus.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src="assets/images/comment-author-03.jpg"
                          alt=""
                          className="w-full h-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-bold text-gray-700">
                          Belisimo Mama
                          <span className="block text-xs font-normal text-gray-500">
                            May 16, 2020
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">
                          Nullam nec pharetra nibh. Cras tortor nulla, faucibus
                          id tincidunt in, ultrices eget ligula. Sed vitae
                          suscipit ligula. Vestibulum id turpis volutpat,
                          lobortis turpis ac, molestie nibh.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white overflow-hidden">
                <div className="py-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Your comment
                  </h2>
                  <form
                    id="comment"
                    action="#"
                    method="post"
                    className="mt-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="name"
                        type="text"
                        id="name"
                        placeholder="Your name"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        name="email"
                        type="email"
                        id="email"
                        placeholder="Your email"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <input
                      name="subject"
                      type="text"
                      id="subject"
                      placeholder="Subject"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      name="message"
                      rows={6}
                      id="message"
                      placeholder="Type your comment"
                      className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                    <button
                      type="submit"
                      id="form-submit"
                      className="inline-block px-6 py-2 bg-blue-500 text-white font-medium rounded ho ver:bg-blue-600"
                    >
                      Kirim
                    </button>
                  </form>
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
                        Suspendisse et metus nec libero ultrices varius eget in
                        risus
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
  );
}
