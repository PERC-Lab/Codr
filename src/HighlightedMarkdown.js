import React, { useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export function HighlightedMarkdown({ children, ...props }) {
  const rootRef = useRef();

  /* POSSIBLE SOLUTION??? 
      => https://github.com/VermontDepartmentOfHealth/docgov/issues/59#issuecomment-573363381
      => https://jsfiddle.net/KyleMit/5gfo8qde/ 
   */

  useEffect(() => {
    if (props.useHighlighter)
      rootRef.current.querySelectorAll("pre code").forEach(
        /**
         *
         * @param {HTMLElement} block HTML Element
         */
        block => {
          console.log(block);
          // const content = block.innerText;
          // const out = hljs.highlight("javascript", content, true);
          // console.log(out);
          // block.innerHtml = out.value;
          hljs.highlightBlock(block);
          // console.log(block.innerText);
        }
      );
  }, [children]);

  return (
    <div ref={rootRef} {...props}>
      <Markdown options={{
        disableParsingRawHTML: false,
        overrides: {
          code: {
            component: ({children, ...props}) => {
              console.log(children)
              return (<code {...props}>{children}</code>)
            }
          }
        }
      }}>{children}</Markdown>
    </div>
  );
}
