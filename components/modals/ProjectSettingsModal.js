import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useProject } from "../../src/ProjectContext";

const useStyles = makeStyles(theme => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    },
  },
}));

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
  const classes = useStyles();

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
          <Typography variant="h6">Labelsets:</Typography>
          <div className={classes.chips}>
            <Typography variant="body1" style={{width: "100%"}}>Privacy Practice:</Typography>
            <Chip
              variant="outlined"
              label="Testing"
              style={{
                borderColor: "aquamarine",
              }}
              size="small"
              onDelete={() => {}}
            />
          </div>
          <div className={classes.chips}>
            <Typography variant="body1" style={{width: "100%"}}>Purpose:</Typography>
            <Chip
              variant="outlined"
              label="Testing"
              style={{
                borderColor: "aquamarine",
              }}
              size="small"
              onDelete={() => {}}
            />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
