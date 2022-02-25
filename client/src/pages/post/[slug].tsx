import "highlight.js/styles/stackoverflow-dark.css";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { client, urlFor } from "../../shared/client";
import { formatDate, markdownToHTML } from "../../shared/utils";

import Error from "../404";
import Link from "next/link";
import Meta from "../../components/Meta";
import Script from "next/script";
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
          <h1 className="mt-8 text-3xl">Bình luận</h1>
          <div
            className="fb-comments my-3 bg-gray-100 px-3"
            data-href={`https://blog.napthedev.com/post/${data.slug.current}`}
            data-width="100%"
            data-numposts="5"
          ></div>

          <h1 className="mt-8 mb-3 text-3xl">Bài viết liên quan</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.related.map((post: any) => (
              <Link key={post.slug.current} href={`/post/${post.slug.current}`}>
                <a className="flex gap-2 group">
                  <img
                    className="w-[70px] h-[70px] flex-shrink-0 group-hover:brightness-90 transition duration-300"
                    src={urlFor(post.mainImage)
                      .fit("clip")
                      .width(70)
                      .height(70)
                      .url()}
                    alt=""
                  />
                  <div className="flex-grow">
                    <h1 className="line-clamp-3 group-hover:text-primary transition duration-300">
                      {post.title}
                    </h1>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v13.0&appId=1005788883628478&autoLogAppEvents=1"
        strategy="lazyOnload"
      ></Script>
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
        _id,
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

  const related = await client.fetch(
    `
    *[_type == "post" && slug.current != $slug]
    | score(
    ${data.categories
      .map((category: any) => `references("${category._id}")`)
      .join(",\n")},
      title match $title 
    ) 
    | order(_score desc) 
    [1..4] {
      title,
      slug,
      mainImage,
    }
  `,
    { slug, title: data.title }
  );

  const result = {
    ...data,
    body: markdownToHTML(data.body),
    related,
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
