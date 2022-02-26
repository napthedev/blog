import type { GetStaticProps, NextPage } from "next";
import { client, urlFor } from "../shared/client";

import Layout from "../components/Layout";
import Link from "next/link";
import Meta from "../components/Meta";
import PostItem from "../components/PostItem";

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
      <Layout>
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
      </Layout>
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
