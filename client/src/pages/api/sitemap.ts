import { BASE_URL } from "../../shared/constant";
import { NextApiHandler } from "next";
import { client } from "../../shared/client";

const handler: NextApiHandler = async (req, res) => {
  res.setHeader("Content-Type", "text/xml");

  const allData = await client.fetch(`
    * [_type in ["post", "category"] && (!(_id match "drafts*"))] | order(_type desc) {
      _type,
      slug,
      _updatedAt
    } 
  `);

  const result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
  </url>
  ${allData
    .map((item: any) =>
      item._type === "post"
        ? `  <url>
    <loc>${BASE_URL}/post/${item.slug.current}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString()}</lastmod>
  </url>`
        : item._type === "category"
        ? `  <url>
    <loc>${BASE_URL}/category/${item.slug.current}</loc>
  </url>`
        : ""
    )
    .join("")}
</urlset>`;

  res.send(result);
};

export default handler;
