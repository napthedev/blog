import { BASE_URL } from "../../shared/constant";
import { NextApiHandler } from "next";
import { client } from "../../shared/client";

const handler: NextApiHandler = async (req, res) => {
  res.setHeader("Content-Type", "text/xml");

  const allData = await client.fetch(`
    *[_type == "post" && (!(_id match "drafts*"))] | order(_updatedAt desc) {
      title,
      slug,
    } [0..4]
  `);

  const result = allData.map((item: any) => ({
    title: item.title,
    url: `${BASE_URL}/post/${item.slug.current}`,
  }));

  res.send(result);
};

export default handler;
