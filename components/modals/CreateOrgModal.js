import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function CreateOrgModal({ open, onCancel, onCreate }) {
  const [name, setName] = React.useState(null);

  const handleCancel = () => {
    onCancel()
  };

  const handleCreate = () => {
    onCreate(name);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create an organization</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your organization's name here.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="org-name"
          label="Organization Name"
          type="text"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleCreate()
            } else {
              setName(e.target.value)
            }
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={!!!name}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
