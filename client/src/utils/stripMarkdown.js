import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";

const markdownProcessor = unified().use(remarkParse).use(remarkGfm);

const flattenMarkdown = (node) => {
  if (node.type === "text" || node.type === "inlineCode" || node.type === "code") {
    return node.value;
  }
  if (node.type === "image") return node.alt;
  if (node.type === "break") return " ";
  if (!node.children) return "";

  const separator =
    node.type === "root" || node.type === "listItem"
      ? " "
      : node.type === "tableRow"
        ? " | "
        : "";
  return node.children.map(flattenMarkdown).filter(Boolean).join(separator);
};

const stripMarkdown = (markdown = "") =>
  flattenMarkdown(markdownProcessor.parse(markdown)).replace(/\s+/g, " ").trim();

export default stripMarkdown;
