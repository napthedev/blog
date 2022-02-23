import dayjs from "dayjs";
import showdown from "showdown";

export const formatDate = (date: string | number) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

const converter = new showdown.Converter({ openLinksInNewWindow: true });
export const markdownToHTML = (text: string) => {
  const result = converter.makeHtml(text);
  return result;
};
