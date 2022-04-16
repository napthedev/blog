import { FC } from "react";
import Link from "next/link";
import { formatDate } from "../shared/utils";
import { urlFor } from "../shared/client";

interface PostItemProps {
  post: any;
  total: number;
  index: number;
}

const PostItem: FC<PostItemProps> = ({ post, total, index }) => {
  return (
    <div
      className={`flex gap-4 py-4 ${
        index < total - 1 ? "border-b dark:border-gray-600" : ""
      }`}
    >
      <Link href={`/post/${post.slug.current}`}>
        <a className="flex-shrink-0 hover:brightness-90 transition duration-300">
          <img
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] border dark:border-gray-600"
            src={urlFor(post.mainImage)
              .fit("clip")
              .width(150)
              .height(150)
              .url()}
            alt=""
          />
        </a>
      </Link>
      <div>
        <Link href={`/post/${post.slug.current}`}>
          <a className="text-primary text-xl md:text-2xl hover:brightness-125 transition duration-300 line-clamp-1 sm:line-clamp-2">
            {post.title}
          </a>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {formatDate(post._updatedAt)}
        </p>
        <p className="text-sm md:text-base line-clamp-2 sm:line-clamp-3">
          {post.description}
        </p>
      </div>
    </div>
  );
};

export default PostItem;
