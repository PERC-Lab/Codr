import React from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";

export function HighlightedMarkdown({ children, ...props }) {
  return (
    <div {...props}>
      <Markdown options={{
        disableParsingRawHTML: false,
        overrides: {
          pre: {
            component: ({children, ...props}) => (<pre {...props} className="hljs" >{children}</pre>)
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
