import ReactMarkdown from "react-markdown";

const allowedElements = ["p", "strong", "em", "ul", "ol", "li", "a", "img", "br"];

const MarkdownDescription = ({ children }) => (
  <ReactMarkdown allowedElements={allowedElements} unwrapDisallowed>
    {children}
  </ReactMarkdown>
);

export default MarkdownDescription;
