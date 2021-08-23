import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";

/**
 *
 * @param {{
 *  open: Boolean,
 *  onExport: Function,
 *  onCancel: Function
 * }} param0 props
 * @returns {React.Component}
 */
export default function GuidelinesModal({ open, onExport, onCancel }) {
  const [limit, setLimit] = useState();
  const [skip, setSkip] = useState();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">Export Dataset</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText id="scroll-dialog-description">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography>
                Leave the limit and skip fields empty to download the entire
                dataset.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Annotation Limit"
                type="number"
                variant="outlined"
                fullWidth
                onChange={e => setLimit(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Skip"
                type="number"
                variant="outlined"
                fullWidth
                onChange={e => setSkip(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onExport({ limit, skip })} color="primary">
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}
