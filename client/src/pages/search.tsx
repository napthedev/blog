import type { GetServerSideProps, NextPage } from "next";

import Layout from "../components/Layout";
import Meta from "../components/Meta";
import PostItem from "../components/PostItem";
import { client } from "../shared/client";

interface SearchProps {
  data: any;
  q: string;
}

const Search: NextPage<SearchProps> = ({ data, q }) => {
  return (
    <>
      <Meta
        title={`Tìm kiếm: ${q}`}
        description="NAPTheDev's Blog"
        image="/avatar.jpg"
      />

      <Layout>
        <h1 className="text-3xl">Tìm kiếm: {q}</h1>
        {data.length === 0 && (
          <p className="text-center text-gray-400 my-5">
            Không tìm thấy bài viết nào ứng với từ khoá tìm kiếm
          </p>
        )}

        {data.map((post: any, index: number) => (
          <PostItem
            key={post.slug.current}
            post={post}
            index={index}
            total={data.length}
          />
        ))}
      </Layout>
    </>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q as string;

  const data = await client.fetch(
    `
      *[_type == "post" && (!(_id match "drafts*"))] 
      | score(
        boost(title match $searchQuery, 2),
        description match $searchQuery
      )
      | order(score desc)
      {
        _score,
        _id,
        title,
        description,
        slug,
        _updatedAt,
        mainImage
      }
      [_score > 0]
    `,
    {
      searchQuery: q,
    }
  );

  return {
    props: {
      data,
      q,
    },
  };
};
