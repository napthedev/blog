import dayjs from "dayjs";
import hljs from "highlight.js";
import { load } from "cheerio";
import showdown from "showdown";

export const formatDate = (date: string | number) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

export const markdownToHTML = (text: string) => {
  const converter = new showdown.Converter({ openLinksInNewWindow: true });
  converter.addExtension({
    type: "output",
    filter: (text: string) => {
      const result = text.replace(/!<img src=".+" alt=".+" \/>/gm, (match) => {
        const title = match.split('"')[3];
        const url = match.split('"')[1];

        if (url.startsWith("https://www.youtube.com/embed"))
          return `
        <div style="width: 100%; height: 0; padding-bottom: 56.25%; position: relative">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" src="${url}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `;

        return `
        <div style="width: 100%; height: 0; padding-bottom: 56.25%; position: relative">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" src="${url}" title="${title}" frameborder="0"></iframe>
        </div>
        `;
      });
      return result;
    },
  });

  const result = converter.makeHtml(text);

  const $ = load(result);

  $("pre code").each(function () {
    const el = $(this);
    const lang = el.attr("class")?.split(" ")[0] as string;
    if (lang) {
      const highlighted = hljs.highlight(el.text() as string, {
        language: lang,
      }).value;
      el.html(highlighted);
    }
  });

  return $("body").html();
};
