import { ProjectLayout } from "../../../../src/Layouts";
import { useSession } from "next-auth/client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Toolbar,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../src/ProjectContext";
import MarkdownEditor from "../../../../src/MarkdownEditor";
import AddDatasetModal from "../../../../components/modals/AddDatasetModal";
import { useState } from "react";
import { useRouter } from "next/router";
import { Settings } from "@material-ui/icons";
import ProjectSettingsModal from "../../../../components/modals/ProjectSettingsModal";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  card: {
    maxWidth: 345,
  },
  title: {
    fontSize: "1.5em",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "0 16px 0 -16px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    "&:active": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },
}));

export default function OrgProject() {
  const [session] = useSession();
  const [org] = useOrganization();
  const [project, setProject] = useProject();
  const classes = useStyles();
  const [openDataset, setOpenDataset] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();

  return (
    <>
      <AddDatasetModal
        onCreate={dataset => {
          insertDataset(org._id, project._id, dataset, () => {
            setProject({
              datasets: [...project.datasets, dataset],
              disableSave: true,
            });
            setOpenDataset(false);
          });
        }}
        onCancel={() => setOpenDataset(false)}
        open={openDataset}
      />
      <ProjectSettingsModal
        onClose={() => setOpenSettings(false)}
        open={openSettings}
      />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Toolbar component={Paper}>
              {project?.name ? (
                <Input
                  className={classes.title}
                  disableUnderline={true}
                  defaultValue={project.name}
                  fullWidth
                  onBlur={e => {
                    setProject({ name: e.target.value });
                  }}
                />
              ) : (
                <Skeleton className={classes.title} width="100%" />
              )}
              <Button
                startIcon={<Settings />}
                onClick={() => setOpenSettings(true)}
              >
                Settings
              </Button>
            </Toolbar>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader
                action={
                  <Button
                    onClick={() => setOpenDataset(true)}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                }
                title="Datasets"
              />
              <CardContent>
                <List>
                  {project?.datasets.map(dataset =>
                    dataset.user == session?.user.email ||
                    org.members.find(m => m.email === session.user.email)
                      .role === "admin" ? (
                      <ListItem
                        button
                        key={dataset.label}
                        onClick={() =>
                          router.push(
                            `/${org._id}/project/${project._id}/${dataset.label}`
                          )
                        }
                      >
                        <ListItemText>{dataset.name}</ListItemText>
                      </ListItem>
                    ) : null
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title="Guidelines" />
              <CardContent>
                <MarkdownEditor
                  value={project?.guidelines}
                  onUpdate={e => {
                    setProject({ guidelines: e.target.value });
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

const insertDataset = (oid, pid, dataset, callback) => {
  fetch(`/api/v1/organization/${oid}/project/${pid}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataset),
  })
    .then(res => res.json())
    .then(res => callback(res.result));
};

OrgProject.Layout = ProjectLayout;
OrgProject.OrganizationProvider = OrganizationProvider;
OrgProject.ProjectProvider = ProjectProvider;
