import dayjs from "dayjs";
import showdown from "showdown";
import hljs from "highlight.js";
import { load } from "cheerio";

export const formatDate = (date: string | number) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

const converter = new showdown.Converter({ openLinksInNewWindow: true });
export const markdownToHTML = (text: string) => {
  const result = converter.makeHtml(text);

  const $ = load(result);

  $("pre code").each(function () {
    const el = $(this);
    const highlighted = hljs.highlight(el.text() as string, {
      language: el.attr("class")?.split(" ")[0] as string,
    }).value;
    el.html(highlighted);
  });

  return $("body").html();
};
