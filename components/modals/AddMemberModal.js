import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

export default function AddMemberModal({ open, onCancel, onCreate }) {
  const [email, setEmail] = React.useState(null);
  const [role, setRole] = React.useState('user');

  const handleChange = (e) => {
    setRole(e.target.value)
  }

  const handleCancel = () => {
    onCancel()
  };

  const handleCreate = () => {
    onCreate({
      email,
      role
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Add a member.</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a member to your organization by entering the new member's email and their role.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="org-email"
          label="Member's Email"
          type="email"
          onKeyUp={(e) => {
            setEmail(e.target.value)
          }}
          fullWidth
        />
        <FormControl>
          <InputLabel id="new-member-role">Role</InputLabel>
          <Select
            labelId="new-member-role"
            id="role"
            value={role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='researcher'>Researcher</MenuItem>
            <MenuItem value='user' default>User</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={!email && !role}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
