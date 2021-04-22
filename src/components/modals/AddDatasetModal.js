import React, { useState } from "react";
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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useOrganization } from "../../OrganizationContext";
import AccessControlManager, { GlobalACL } from "../../../lib/abac";

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
        grants: perms
      }
    }
    f.permissions = p;
    console.log(p)
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
            <Accordion>
              <AccordionSummary>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </AccordionSummary>
              <AccordionDetails>
                <PermissionEditor
                  key={`permeditor-${role}`}
                  role={role}
                  resources={[
                    {
                      value: "dataset",
                      display: "Dataset",
                    },
                    {
                      value: "annotation",
                      display: "Annotation",
                    },]}
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

const PermissionEditor = function PermissionEditor({
  role,
  resources,
  actions,
  attributes,
  onChange
}) {
  const [permissions, setPermissions] = useState([]);

  const handleChange = perms => {
    setPermissions(perms)
    onChange(perms)
  }

  return (
    <>
      <TableContainer>
        <Table aria-label="permission table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Resource</TableCell>
              <TableCell>Perform</TableCell>
              <TableCell>Attribute(s)</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((perm, i) => (
              <TableRow key={`perm-${role}-${i}`}>
                <TableCell component="th" scope="row">
                  <FormControl style={{ width: "100%" }}>
                    <Select
                      id="resources"
                      value={perm.resource[0]}
                      onChange={e => {
                        const perms = [...permissions];
                        perms[i].resource = [e.target.value];
                        handleChange(perms);
                      }}
                      style={{ width: "100%" }}
                    >
                      {resources.map(resource => (
                        <MenuItem
                          value={resource.value}
                          key={`resource-${resource.value}-${i}`}
                        >
                          {resource.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl style={{ width: "100%" }}>
                    <Select
                      id="action"
                      value={perm.action[0]}
                      onChange={e => {
                        const perms = [...permissions];
                        perms[i].action = [e.target.value];
                        setPermissions(perms);
                      }}
                      style={{ width: "100%" }}
                    >
                      {actions.map(action => (
                        <MenuItem
                          value={action.value}
                          key={`action-${action.value}-${i}`}
                        >
                          {action.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl style={{ width: "100%" }}>
                    <Select
                      id="attributes"
                      value={perm.attributes}
                      onChange={e => {
                        const perms = [...permissions];
                        perms[i].attributes = e.target.value;
                        handleChange(perms);
                      }}
                      multiple
                      style={{ width: "100%" }}
                    >
                      {attributes.map(att => (
                        <MenuItem
                          value={att.value}
                          key={`attribute-${att.value}-${i}`}
                        >
                          {att.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      const perms = [...permissions];
                      perms.splice(i, 1);
                      handleChange(perms);
                    }}
                    size="small"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right" colSpan={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const perms = [...permissions];
                    perms.push({
                      resource: [resources[0].value],
                      action: [actions[0].value],
                      attributes: [attributes[0].value],
                    });
                    handleChange(perms);
                  }}
                >
                  Add permission
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
