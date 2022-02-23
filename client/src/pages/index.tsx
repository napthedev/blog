import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Meta from "../components/Meta";
import { client, urlFor } from "../shared/client";
import { formatDate } from "../shared/utils";

interface HomeProps {
  posts: any;
  categories: any;
}

const Home: NextPage<HomeProps> = ({ posts, categories }) => {
  return (
    <>
      <Meta
        title="NAPTheDev's Blog"
        description="Blog chia sẻ kinh nghiệm của mình"
        image="/illustration.jpg"
      />
      <div className="flex justify-center mx-6">
        <div className="flex flex-col items-stretch w-full max-w-[700px] min-h-screen my-5 md:my-10">
          {posts.map((post: any, index: number) => (
            <div
              key={post.slug.current}
              className={`flex gap-4 py-4 ${
                index < posts.length - 1 ? "border-b dark:border-gray-600" : ""
              }`}
            >
              <Link href={`/post/${post.slug.current}`}>
                <a className="flex-shrink-0 hover:brightness-90 transition duration-300">
                  <img
                    className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]"
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
          ))}

          <div className="flex gap-x-2 flex-wrap">
            <p>Tags: </p>
            {categories.map((category: any) => (
              <Link
                key={category.slug.current}
                href={`/category/${category.slug.current}`}
              >
                <a className="text-primary">{category.title}</a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.fetch(`
    {
      "posts": *[_type == "post"] | order(_updatedAt asc) {
        title,
        description,
        slug,
        _updatedAt,
        mainImage,
      },
      "categories": *[_type == "category"] | order(_createdAt asc) {
        title,
        slug
      }
    }
  `);

  return {
    props: {
      ...data,
    },
    revalidate: 60,
  };
};
