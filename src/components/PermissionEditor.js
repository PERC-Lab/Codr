import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export default function PermissionEditor({
  role,
  resources,
  actions,
  attributes,
  values,
  onChange
}) {
  const [permissions, setPermissions] = useState(!!values ? values : []);

  useEffect(() =>{
    setPermissions(!!values ? values : []);
  }, [values])

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
              <TableCell>Perform</TableCell>
              <TableCell>Attribute(s)</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions?.map((perm, i) => (
              <TableRow key={`perm-${role}-${i}`}>
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