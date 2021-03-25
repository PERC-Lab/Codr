import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function AddProjectModal({ open, onCancel, onCreate }) {
  const [form, setForm] = React.useState({});

  const handleChange = e => {
    const f = { ...form };
    f[e.target.name] = e.target.value;
    setForm(f);
  };

  const handleCancel = () => {
    onCancel();
    setForm({});
  };

  const handleCreate = () => {
    onCreate({ ...form });
    setForm({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Add a project.</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a project, fill out the form below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="project-name"
          label="Project Name"
          name="name"
          defaultValue={form?.name}
          autoComplete="false"
          onKeyUp={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="project-guidelines"
          label="Guidelines"
          name="guidelines"
          defaultValue={form?.guidelines}
          autoComplete="false"
          onKeyUp={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          color="primary"
          variant="contained"
          disabled={!!!form?.name}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
