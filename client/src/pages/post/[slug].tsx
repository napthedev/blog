import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  copyToClipboard,
  formatDate,
  markdownToHTML,
} from "../../shared/utils";
import { useEffect, useRef } from "react";

// @ts-ignore
import AnchorJS from "anchor-js";
import Layout from "../../components/Layout";
import Link from "next/link";
import Meta from "../../components/Meta";
import Script from "next/script";
import SocialShare from "../../components/SocialShare";
import { client } from "../../shared/client";
import { urlFor } from "../../shared/url-builder";
import { useRouter } from "next/router";

interface PostProps {
  data: any;
}

const Post: NextPage<PostProps> = ({ data }) => {
  const router = useRouter();

  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchors = new AnchorJS();
    anchors.add();

    const pres = document.querySelectorAll("pre");
    pres.forEach((pre) => {
      pre.style.position = "relative";
      const codeEl = pre.querySelector("code");
      const button = document.createElement("button");
      button.classList.add("copy-btn");
      button.title = "Copy to clipboard";

      const CLIPBOARD_ICON = `<svg style="height: 20px; width: 20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#fff" d="M320 64h-49.61C262.1 27.48 230.7 0 192 0S121 27.48 113.6 64H64C28.65 64 0 92.66 0 128v320c0 35.34 28.65 64 64 64h256c35.35 0 64-28.66 64-64V128C384 92.66 355.3 64 320 64zM192 48c13.23 0 24 10.77 24 24S205.2 96 192 96S168 85.23 168 72S178.8 48 192 48zM336 448c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V128c0-8.82 7.178-16 16-16h18.26C80.93 117.1 80 122.4 80 128v16C80 152.8 87.16 160 96 160h192c8.836 0 16-7.164 16-16V128c0-5.559-.9316-10.86-2.264-16H320c8.822 0 16 7.18 16 16V448z"/></svg>`;

      const COPIED_CLIPBOARD_ICON = `<span>Copied</span>${CLIPBOARD_ICON}`;

      button.innerHTML = CLIPBOARD_ICON;

      button.onclick = () => {
        copyToClipboard(codeEl?.innerText as string);
        button.innerHTML = COPIED_CLIPBOARD_ICON;

        setTimeout(() => {
          button.innerHTML = CLIPBOARD_ICON;
        }, 1000);
      };

      pre.appendChild(button);
    });

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
        <p className="text-lg">{data.description}</p>
        <article
          className="prose prose-lg dark:prose-invert prose-headings:text-sky-600 dark:prose-headings:text-sky-400 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:mt-8 prose-headings:mb-6 prose-pre:bg-[#121213] prose-pre:p-4"
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
      <Script
        id="facebook-comments"
        async
        defer
        crossOrigin="anonymous"
        src={`https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v13.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&autoLogAppEvents=1`}
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
    fallback: "blocking",
  };
};
