import Link from "next/link";
import { FC } from "react";

const Navbar: FC = () => {
  return (
    <div className="h-14 shadow dark:shadow-gray-600 flex justify-between items-center px-6">
      <Link href="/">
        <a className="flex items-center gap-2">
          <img className="h-8 w-8" src="/logo.png" alt="" />
          <h1 className="text-lg">NAPTheDev{"'"}s Blog</h1>
        </a>
      </Link>
      <form className="relative hidden md:block">
        <input
          type="text"
          className="outline-none bg-[#F0F2F5] dark:bg-[#3A3B3C] py-[6px] px-3 rounded-full placeholder:text-gray-400"
          placeholder="Tìm kiếm bài viết"
        />
        <button className="absolute top-1/2 -translate-y-1/2 right-2">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              className="fill-gray-500 dark:fill-gray-400"
              d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Navbar;
