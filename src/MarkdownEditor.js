import { Input, makeStyles, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { compiler } from "markdown-to-jsx";
import { useState } from "react";
import { HighlightedMarkdown } from "./HighlightedMarkdown";

const useStyles = makeStyles((theme) => ({
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
    }
  }
}));

export default function MarkdownEditor({ value, onUpdate }) {
  const [isEditor, setEditor] = useState(false);
  const classes = useStyles();

  return isEditor ? (
    <Input
      disableUnderline={true}
      defaultValue={value}
      fullWidth
      multiline
      onBlur={(e) => {
        onUpdate(e);
        setEditor(false);
      }}
      className={classes.input}
      autoFocus
    />
  ) : value ? (
    <HighlightedMarkdown className={classes.text} onClick={() => setEditor(true)} >
      {value}
    </HighlightedMarkdown>
    // <div >
    //   {compiler(value)}
    // </div>
  ) : <Skeleton />;
}
