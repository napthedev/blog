import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: "production",
});

export const urlFor = (source: any) => builder.image(source);
