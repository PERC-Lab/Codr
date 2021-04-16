import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { HighlightedMarkdown } from '../../HighlightedMarkdown';

/**
 * 
 * @param {{
 *  open: Boolean,
 *  onClose: Function,
 *  children: String
 * }} param0 props
 * @returns {React.Component}
 */
export default function GuidelinesModal({ open, onClose, children }) {
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
      <DialogTitle id="scroll-dialog-title">Guidelines</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
        >
          <HighlightedMarkdown>
            {children ? children : "No guidelines are available for this project!"}
          </HighlightedMarkdown>
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
