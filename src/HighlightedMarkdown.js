import React, { useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export function HighlightedMarkdown({ children, ...props }) {
  return (
    <div {...props}>
      <Markdown options={{
        disableParsingRawHTML: false,
        overrides: {
          pre: {
            component: ({children, ...props}) => (<pre className="hljs">{children}</pre>)
          },
          code: {
            component: ({children, ...props}) => {
              return (<code {...props} dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(children).value}} />)
            }
          }
        }
      }}>{children}</Markdown>
    </div>
  );
}
