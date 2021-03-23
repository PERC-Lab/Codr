import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React from "react";

/**
 *
 * @param {{
 *  open: Boolean,
 *  onClose: Function
 * }} param0 props
 * @returns {React.Component}
 */
export default function ProjectSettingsModal({ open, onClose }) {
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
        <DialogContentText id="scroll-dialog-description">
          <Typography variant="h5">Labelsets:</Typography>
          <span>Chips will appear here</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}
