import { useState } from "react";
import { Button, Chip, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  labelset: {
    margin: `0 ${theme.spacing(2)}px`,
  },
}));

export default function AddLabelset({ title, labels }) {
  const [editing, setEditing] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.labelset}>
      <Typography variant="body1">{title}:</Typography>
      <div className={classes.chips}>
        {labels?.length ? (
          labels.map((label, index) => (
            <Chip
              key={`chip-label-${index}`}
              variant="outlined"
              label={
                typeof label["sub-label"] !== "undefined"
                  ? `${label.label} : ${label["sub-label"]}`
                  : label.label
              }
              style={{
                borderColor: label.color,
              }}
              size="small"
              onDelete={()=>{}}
            />
          ))
        ) : (
          <Chip variant="outlined" label="No labels found" size="small" />
        )}
      </div>
      {editing ? (
        <Button
          onClick={() => {
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      ) : (
        <Button
          onClick={() => {
            setEditing(true);
          }}
        >
          Add label
        </Button>
      )}
    </div>
  );
}
