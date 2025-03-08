"use client";
import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Sliders() {
  return (
    <div className="w-full h-[500] mt-2 mx-auto mb-10">
      <section>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[500] rounded-2xl overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  BRING <span className="text-green-400">NATURE</span> INDOORS
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Create your own urban jungle with our fresh plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
            ;
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  BRING <span className="text-green-400">NATURE</span> INDOORS
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Create your own urban jungle with our fresh plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
            ;
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  BRING <span className="text-green-400">NATURE</span> INDOORS
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Create your own urban jungle with our fresh plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
            ;
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  BRING <span className="text-green-400">NATURE</span> INDOORS
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Create your own urban jungle with our fresh plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
            ;
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  BRING <span className="text-green-400">NATURE</span> INDOORS
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Create your own urban jungle with our fresh plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
            ;
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  );
}

export default Sliders;
