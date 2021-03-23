import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useProject } from "../../src/ProjectContext";
import AddLabelset from "../AddLabelset";

/**
 *
 * @param {{
 *  open: Boolean,
 *  onClose: Function
 * }} param0 props
 * @returns {React.Component}
 */
export default function ProjectSettingsModal({ open, onClose }) {
  const [project, setProject] = useProject();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">Project Settings</DialogTitle>
      <DialogContent dividers={true}>
        <Typography variant="h6">Labelsets:</Typography>
        <AddLabelset labels={[]} title="Privacy Practices" />
        <AddLabelset
          labels={[
            {
              label: "Functionality",
              color: "orange",
            },
            {
              label: "Functionality",
              "sub-label": "Authentiction",
              color: "yellow",
            },
            {
              label: "Advertisement",
              color: "red",
            },
            {
              label: "Analytics",
              color: "aqua",
            },
            {
              label: "Analytics",
              "sub-label": "User Experience",
              color: "green",
            },
            {
              label: "Analytics",
              "sub-label": "Crash Analytics",
              color: "blue",
            },
          ]}
          title="Purpose"
        />
        <span>
          <Typography component="span">Create a new labelset: </Typography>
          <TextField placeholder="My labelset" />
          <Button onClick={() => {}}>Create</Button>
        </span>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
