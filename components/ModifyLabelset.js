import { useState } from "react";
import {
  Button,
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { ColorPicker } from "material-ui-color";
import { isEqual } from "lodash";

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
  form: {
    maxWidth: "calc(100% - 2rem)",
    margin: "1rem",
  },
}));

/**
 *
 * @param {{
 *  title: String,
 *  labels: { label: String, "sub-label": String, color: String }[]
 *  onChange: Function
 * }} param0 Props
 * @returns {React.Component}
 */
export default function ModifyLabelset({ title, labels, onChange }) {
  const defaultForm = {
    label: undefined,
    "sub-label": null,
    color: "grey",
  };
  const [editing, setEditing] = useState(false);
  const classes = useStyles();
  const [form, setForm] = useState(defaultForm);

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
                // Apply sub-label to chip if presented.
                typeof label["sub-label"] !== "undefined" &&
                !!label["sub-label"]
                  ? `${label.label} : ${label["sub-label"]}`
                  : label.label
              }
              style={{ backgroundColor: label.color }}
              size="small"
              onDelete={() => {
                // return array of labels exculding the one being deleted to onChange.
                onChange(labels.filter(l => !isEqual(l, label)));
              }}
            />
          ))
        ) : (
          // Return default chip.
          <Chip variant="outlined" label="No labels found" size="small" />
        )}
      </div>
      {editing ? (
        <>
          <FormControl fullWidth className={classes.form}>
            <FormLabel>Add a label to this set:</FormLabel>
            <span>
              Preview:{" "}
              <Chip
                label={
                  typeof form["sub-label"] !== "undefined" && form["sub-label"]
                    ? `${form.label} : ${form["sub-label"]}`
                    : form.label
                }
                size="small"
                style={{ backgroundColor: form.color }}
                variant="outlined"
              />
            </span>
            <FormGroup>
              <TextField
                placeholder="Label"
                required
                aria-required
                onKeyUp={e => {
                  setForm(form => {
                    const f = { ...form };
                    f.label = e.target.value;
                    return f;
                  });
                }}
              />
              <TextField
                placeholder="Sub-label"
                onKeyUp={e => {
                  setForm(form => {
                    const f = { ...form };
                    f["sub-label"] =
                      e.target.value == "" ? undefined : e.target.value;
                    return f;
                  });
                }}
              />
              <ColorPicker
                value={form.color}
                onChange={value => {
                  setForm(form => {
                    const f = { ...form };
                    f.color = value?.value ? `#${value?.hex}` : value;
                    return f;
                  });
                }}
              />
            </FormGroup>
            <span style={{ textAlign: "right" }}>
              <Button
                onClick={() => {
                  setEditing(false);
                  setForm(defaultForm);
                }}
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  const f = { ...form };
                  onChange([...labels, form]);
                }}
                variant="contained"
                color="primary"
                disabled={!form.label}
              >
                Create
              </Button>
            </span>
          </FormControl>
        </>
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
