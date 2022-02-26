import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import Error from "../404";
import Layout from "../../components/Layout";
import Meta from "../../components/Meta";
import PostItem from "../../components/PostItem";
import { client } from "../../shared/client";

interface CategoryProps {
  data: any;
}

const Category: NextPage<CategoryProps> = ({ data }) => {
  if (!data) return <Error />;

  return (
    <>
      <Meta
        title={`Danh mục: ${data.title}`}
        description="NAPTheDev's Blog"
        image="/illustration"
      />
      <Layout>
        <h1 className="text-3xl">Danh mục: {data.title}</h1>
        {data.posts.length === 0 && (
          <p className="text-center text-gray-400 my-5">
            Chưa có bài viết nào về danh mục này.
          </p>
        )}

        {data.posts.map((post: any, index: number) => (
          <PostItem
            key={post.slug.current}
            post={post}
            index={index}
            total={data.posts.length}
          />
        ))}
      </Layout>
    </>
  );
};

export default Category;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const res = await client.fetch(
    `
    *[_type == "category" && slug.current == $slug] {
      slug,
      title,
      "posts": *[_type == "post" && references(^._id) && (!(_id match "drafts*"))] | order(_updatedAt desc) {
        title,
        description,
        slug,
        _updatedAt,
        mainImage,
      }
    }
  `,
    {
      slug,
    }
  );

  const data = res?.[0];

  if (!data)
    return {
      notFound: true,
    };

  return {
    props: { data },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.fetch(`
    *[_type == "category"] | order(_createdAt asc) {
      slug
    }
  `);

  return {
    paths: data.map((item: any) => ({
      params: {
        slug: item.slug.current,
      },
    })),
    fallback: true,
  };
};
