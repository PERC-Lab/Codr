import { ProjectLayout } from "../../../../../src/Layouts";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../../src/ProjectContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  FormControl,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccessControlManager from "../../../../../lib/abac";
import PermissionEditor from "../../../../../src/components/PermissionEditor";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  title: {
    width: "calc(100% + 32px)",
    fontSize: "1.5em",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "0 -16px 0 -16px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    "&:active": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },
}));

export default function ProjectDataset() {
  const router = useRouter();
  const [org] = useOrganization();
  const [project, setProject] = useProject();
  const [dataset, setDataset] = useState({ save: false });
  const classes = useStyles();
  const [permExpanded, setPermExpanded] = useState(false);

  /**
   * @type {[AccessControlManager, function]}
   */
  const [ACL, setACL] = useState();

  useEffect(() => {
    console.log(dataset);
    if (typeof dataset !== "undefined" && dataset.save) {
      delete dataset.save;
      updateDataset(
        router.query.oid,
        router.query.pid,
        dataset._id,
        dataset
      ).then(p => {
        console.log(p);
        if (typeof p === "object") {
          setProject({
            ...p,
            disableSave: true,
          });
          setDataset({
            ...dataset,
            save: false,
          });
        }
      });
    }
  }, [dataset]);

  if (dataset?.label !== router.query["dataset-label"] && org && project) {
    const d = project.datasets.find(
      p => p.label == router.query["dataset-label"]
    );
    setACL(() => {
      const ac = new AccessControlManager(d?.permissions);
      return ac;
    });
    setDataset({ ...d, save: false });
  }

  const handlePermissionChange = (role, perms) => {
    const d = { ...dataset };
    const p = {
      ...d.permissions,
      [role]: {
        grants: perms,
      },
    };
    d.permissions = p;
    console.log(p);
    setDataset({
      ...d,
      save: true,
    });
  };

  const handleChange = e => {
    const d = { ...dataset, save: false };
    d[e.target.name] = e.target.value;
    setDataset(d);
  };

  const handlePermExpandedChange = panel => (event, isExpanded) => {
    setPermExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Toolbar component={Paper}>
          {dataset?.name ? (
            <Input
              className={classes.title}
              disableUnderline={true}
              defaultValue={dataset.name}
              fullWidth
              onBlur={e => {
                setDataset(d => ({ ...d, name: e.target.value, save: true }));
              }}
            />
          ) : (
            <Skeleton className={classes.title} />
          )}
        </Toolbar>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            General
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel id="member-label">User(s) Assigned:</InputLabel>
                <Select
                  labelId="member-label"
                  id="user"
                  name="user"
                  value={dataset?.user || []}
                  multiple
                  onChange={handleChange}
                  onBlur={() => {
                    setDataset(d => ({
                      ...d,
                      save: true,
                    }));
                  }}
                >
                  {org?.members.map(member => (
                    <MenuItem value={member.email} key={member.email}>
                      {member.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Permissions
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {ACL?.roles.map(role => (
            <Accordion
              key={`perm-accordion-${role}`}
              expanded={permExpanded === role}
              onChange={handlePermExpandedChange(role)}
            >
              <AccordionSummary>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </AccordionSummary>
              <AccordionDetails>
                <PermissionEditor
                  key={`permeditor-${role}`}
                  role={role}
                  values={ACL.ac.getGrants()[role]?.grants}
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
        </Grid>
      </Grid>
    </Grid>
  );
}

const updateDataset = (oid, pid, did, dataset) => {
  return fetch(`/api/v1/organization/${oid}/project/${pid}/${did}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataset),
  })
    .then(res => res.json())
    .then(res => res.result);
};

ProjectDataset.Layout = ProjectLayout;
ProjectDataset.OrganizationProvider = OrganizationProvider;
ProjectDataset.ProjectProvider = ProjectProvider;
