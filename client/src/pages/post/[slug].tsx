import "highlight.js/styles/stackoverflow-dark.css";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { client, urlFor } from "../../shared/client";
import { formatDate, markdownToHTML } from "../../shared/utils";

import Error from "../404";
import Link from "next/link";
import Meta from "../../components/Meta";
import SocialShare from "../../components/SocialShare";

interface PostProps {
  data: any;
}

const Post: NextPage<PostProps> = ({ data }) => {
  if (!data) return <Error />;

  return (
    <>
      <Meta
        title={data.title}
        description={data.description}
        image={urlFor(data.mainImage).url()}
      />
      <div className="flex justify-center mx-6">
        <div className="flex flex-col items-stretch w-full max-w-[700px] min-h-screen my-5 md:my-10">
          <h1 className="text-4xl font-semibold dark:text-white">
            {data.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 my-3">
            {formatDate(data._updatedAt)}
          </p>
          <div className="flex gap-2 flex-wrap">
            {data.categories.map((category: any) => (
              <Link
                key={category.slug.current}
                href={`/category/${category.slug.current}`}
              >
                <a className="text-primary border-primary border px-2 rounded hover:bg-primary hover:text-white transition duration-300">
                  {category.title}
                </a>
              </Link>
            ))}
          </div>
          <SocialShare title={data.title} />
          <p className="my-4">{data.description}</p>
          <div
            className="prose dark:prose-invert prose-headings:text-sky-500 dark:prose-headings:text-sky-400 prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-headings:mt-6 prose-headings:mb-4 prose-pre:bg-[#121213]"
            dangerouslySetInnerHTML={{ __html: data.body }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Post;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const res = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug && (!(_id match "drafts*"))] {
      ...,
      categories[]->{
        title,
        slug
      }
    }`,
    {
      slug,
    }
  );

  const data = res?.[0];

  if (!data)
    return {
      notFound: true,
    };

  const result = {
    ...data,
    body: markdownToHTML(data.body),
  };

  return {
    props: {
      data: result,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.fetch(`
    *[_type == "post" && (!(_id match "drafts*"))] | order(_updatedAt asc) {
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
