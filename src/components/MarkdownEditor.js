import { Input, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import { HighlightedMarkdown } from "./HighlightedMarkdown";

const useStyles = makeStyles(theme => ({
  input: {
    width: "calc(100% + 16px)",
    background:
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.04)"
        : "rgba(255, 255, 255, 0.08)",
    borderRadius: 4,
    padding: "8px",
    margin: "-8px",
  },
  text: {
    borderRadius: 4,
    padding: "4px 8px",
    margin: "-8px",
    "&:hover": {
      background:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.04)"
          : "rgba(255, 255, 255, 0.08)",
    },
  },
}));

/**
 * @param {{
 *  value: String,
 *  onUpdate: Function}
 * } props
 * @returns {React.Component}
 */
export default function MarkdownEditor({ value, onUpdate }) {
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
      onClick={() => setEditor(true)}
    >
      {value ? value : "No guidelines are available for this project!"}
    </HighlightedMarkdown>
  );
}
