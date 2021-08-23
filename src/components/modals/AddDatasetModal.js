import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useOrganization } from "src/OrganizationContext";
import AccessControlManager from "lib/abac";
import PermissionEditor from "src/components/PermissionEditor";

const ACL = new AccessControlManager();

const useStyles = makeStyles({
  select: {
    width: "100%",
  },
  header: {
    fontSize: 16,
    color: "#fff",
    margin: "1em 0",
    fontWeight: "bold",
  },
  permHeader: {
    color: "#fff",
  },
});

export default function AddDatasetModal({ open, onCancel, onCreate }) {
  const [organization] = useOrganization();
  const [form, setForm] = React.useState({
    permissions: {},
  });
  const classes = useStyles();

  const handleChange = e => {
    const f = { ...form };
    f[e.target.name] = e.target.value;
    setForm(f);
  };

  const handlePermissionChange = (role, perms) => {
    const f = { ...form };
    const p = {
      ...f.permissions,
      [role]: {
        grants: perms,
      },
    };
    f.permissions = p;
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
        <FormControl className={classes.select}>
          <InputLabel id="member-label">User(s) Assigned</InputLabel>
          <Select
            labelId="member-label"
            id="user"
            name="user"
            value={form?.user || []}
            multiple
            onChange={handleChange}
            className={classes.select}
          >
            {organization?.members.map(member => (
              <MenuItem value={member.email} key={member.email}>
                {member.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DialogContentText className={classes.header}>
          Permissions:
        </DialogContentText>
        <DialogContentText>
          {ACL.roles.map(role => (
            <Accordion key={`perm-accordion-${role}`}>
              <AccordionSummary>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </AccordionSummary>
              <AccordionDetails>
                <PermissionEditor
                  key={`permeditor-${role}`}
                  role={role}
                  values={
                    form.permissions ? form.permissions[role]?.grants : []
                  }
                  resources={[
                    {
                      value: "dataset",
                      display: "Dataset",
                    },
                    {
                      value: "annotation",
                      display: "Annotation",
                    },
                  ]}
                  actions={[
                    {
                      value: "read",
                      display: "Read",
                    },
                    {
                      value: "write",
                      display: "Write",
                    },
                    {
                      value: "update",
                      display: "Update",
                    },
                    {
                      value: "delete",
                      display: "Delete",
                    },
                    {
                      value: "*",
                      display: "Any",
                    },
                  ]}
                  attributes={[
                    {
                      value: "*",
                      display: "Any",
                    },
                  ]}
                  onChange={perms => {
                    handlePermissionChange(role, perms);
                  }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContentText>
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
