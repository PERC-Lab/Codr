import React, { useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export function HighlightedMarkdown({ children, ...props }) {
  const rootRef = useRef();

  useEffect(() => {
    rootRef.current.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [children]);

  return (
    <div ref={rootRef} {...props}>
      <Markdown>{children}</Markdown>
    </div>
  );
}