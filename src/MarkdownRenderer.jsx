import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ inline, className, children, ...props }) {
          const copyToClipboard = () => {
            navigator.clipboard.writeText(children);
          };

          return !inline ? (
            <div className="relative bg-[#1E1E1E] text-gray-200 rounded-lg p-3 my-2">
              <SyntaxHighlighter
                style={oneDark}
                language={className?.replace("language-", "")}
                PreTag="div"
                customStyle={{ background: "transparent" }}
              >    {/* //  piyush  */}
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
          ) : (
            <code className="bg-gray-800 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownRenderer;
