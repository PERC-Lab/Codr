import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useOrganization } from "../../OrganizationContext";

const useSelectStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function AddDatasetModal({ open, onCancel, onCreate }) {
  const [organization] = useOrganization();
  const [form, setForm] = React.useState({
    permissions: {}
  });
  const selectClassses = useSelectStyles();

  const handleChange = (e) => {
    const f = { ...form };
    f[e.target.name] = e.target.value;
    setForm(f);
  };

  const handleCancel = () => {
    setForm({});
    onCancel();
  };

  const handleCreate = () => {
    const f = { ...form };
    f["label"] = f.name.trim().toLowerCase().replace(" ", "-");
    setForm({});
    onCreate(f);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Add a dataset.</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a dataset, fill out the form below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="org-email"
          label="Dataset Name"
          name="name"
          defaultValue={form?.name}
          autoComplete="false"
          onKeyUp={handleChange}
          fullWidth
        />
        <FormControl className={selectClassses.root}>
          <InputLabel id="member-label">User(s) Assigned</InputLabel>
          <Select
            labelId="member-label"
            id="user"
            name="user"
            value={form?.user || []}
            multiple
            onChange={handleChange}
            className={selectClassses.root}
          >
            {organization?.members.map((member) => (
              <MenuItem value={member.email} key={member.email}>
                {member.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          color="primary"
          disabled={!(!!form?.user && !!form?.name)}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
