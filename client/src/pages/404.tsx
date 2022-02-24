import type { NextPage } from "next";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <img className="w-[200px] h-[200px]" src="/sad-avatar.png" alt="" />
      <h1 className="text-2xl">404 Not Found</h1>
      <Link href="/">
        <a className="text-primary">Về trang chủ</a>
      </Link>
    </div>
  );
};

export default NotFound;
