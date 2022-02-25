import type { GetStaticProps, NextPage } from "next";
import { client, urlFor } from "../shared/client";

import Link from "next/link";
import Meta from "../components/Meta";
import PostItem from "../components/PostItem";
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
            <PostItem
              key={post.slug.current}
              post={post}
              index={index}
              total={posts.length}
            />
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
      "posts": *[_type == "post" && (!(_id match "drafts*"))] | order(_updatedAt desc) {
        title,
        description,
        slug,
        _updatedAt,
        mainImage,
        ...
      },
      "categories": *[_type == "category"] | order(_createdAt asc) {
        title,
        slug
      }
    }
  `);
  console.log(data);

  return {
    props: {
      ...data,
    },
    revalidate: 60,
  };
};
