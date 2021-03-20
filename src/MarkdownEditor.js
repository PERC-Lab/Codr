import { Input, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import { HighlightedMarkdown } from "./HighlightedMarkdown";

const useStyles = makeStyles(() => ({
  input: {
    width: "calc(100% + 16px)",
    background: "rgba(0,0,0,0.2)",
    borderRadius: 4,
    color: "rgba(255, 255, 255, 0.8)",
    padding: "8px",
    margin: "-8px",
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "-8px",
    "&:hover": {
      background: "rgba(0,0,0,0.2)",
    },
  },
}));

/**
 * @param {{
 *  value: String,
 *  useHighlighter: Boolean,
 *  onUpdate: Function}
 * } props
 * @returns {React.Component}
 */
export default function MarkdownEditor({ value, useHighlighter, onUpdate }) {
  const [isEditor, setEditor] = useState(false);
  const classes = useStyles();

  return isEditor ? (
    <Input
      disableUnderline={true}
      defaultValue={value}
      fullWidth
      multiline
      onBlur={e => {
        onUpdate(e);
        setEditor(false);
      }}
      className={classes.input}
      autoFocus
    />
  ) : (
    <HighlightedMarkdown
      className={classes.text}
      useHighlighter={useHighlighter}
      onClick={() => setEditor(true)}
    >
      {value ? value : "There are *no* guidelines for this project!"}
    </HighlightedMarkdown>
  );
}
