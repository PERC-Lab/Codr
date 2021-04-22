import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { keys } from "lodash";
import React, { useState } from "react";
import { useProject } from "../../ProjectContext";
import ModifyLabelset from "../ModifyLabelset";

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
  /**
   * @type {[string, function]}
   */
  const [newLabelset, setNewLabelset] = useState("");

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
        {keys(project?.labelsets).map(key => (
          <ModifyLabelset
            key={`labelset-${key}`}
            labels={[...project.labelsets[key].labels]}
            title={project.labelsets[key].title}
            onChange={labels => {
              const ls = { labelsets: { ...project.labelsets } };
              // need to replace entire object for auto-change detect to pick it up.
              ls.labelsets[key] = {
                title: project.labelsets[key].title,
                labels: [...labels],
              };
              setProject(ls);
            }}
          />
        ))}
        <span>
          <Typography component="span">Create a new labelset: </Typography>
          <TextField
            placeholder="My labelset"
            value={newLabelset}
            onChange={e => {
              setNewLabelset(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              const key = newLabelset.toLowerCase().replaceAll(/\s/g, "_");
              const ls = { labelsets: { ...project.labelsets } };
              ls.labelsets[key] = { title: newLabelset, labels: [] };
              setProject(ls);
              setNewLabelset("");
            }}
            disabled={newLabelset === ""}
          >
            Create
          </Button>
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
