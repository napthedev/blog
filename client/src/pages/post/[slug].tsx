import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { client, urlFor } from "../../shared/client";
import { formatDate, markdownToHTML } from "../../shared/utils";
import { useEffect, useRef } from "react";

import Layout from "../../components/Layout";
import Link from "next/link";
import Meta from "../../components/Meta";
import SocialShare from "../../components/SocialShare";
import { useRouter } from "next/router";

interface PostProps {
  data: any;
}

const Post: NextPage<PostProps> = ({ data }) => {
  const router = useRouter();

  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentContainerRef.current?.innerHTML &&
      (commentContainerRef.current.innerHTML = "");
    // @ts-ignore
    window?.FB?.XFBML?.parse();
  }, [router.asPath]);

  return (
    <>
      <Meta
        title={data.title}
        description={data.description}
        image={urlFor(data.mainImage).url()}
      />
      <Layout>
        <h1 className="text-4xl font-semibold dark:text-white">{data.title}</h1>
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
        <article
          className="prose dark:prose-invert prose-headings:text-sky-600 dark:prose-headings:text-sky-400 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:mt-8 prose-headings:mb-6 prose-pre:bg-[#121213]"
          dangerouslySetInnerHTML={{ __html: data.body }}
        ></article>
        <h1 className="mt-8 text-3xl">Bình luận</h1>
        <div
          ref={commentContainerRef}
          className="fb-comments my-3 bg-gray-100 px-3"
          data-href={`https://blog.napthedev.com/post/${data.slug.current}`}
          data-width="100%"
          data-numposts="5"
          data-order-by="reverse_time"
        ></div>

        <h1 className="mt-8 mb-3 text-3xl">Bài viết liên quan</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.related.map((post: any) => (
            <Link key={post.slug.current} href={`/post/${post.slug.current}`}>
              <a className="flex gap-2 group">
                <img
                  className="w-[70px] h-[70px] flex-shrink-0 group-hover:brightness-90 transition duration-300 border dark:border-gray-600"
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
      </Layout>
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
    fallback: "blocking",
  };
};
