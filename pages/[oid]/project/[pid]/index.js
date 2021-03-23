import { ProjectLayout } from "../../../../src/Layouts";
import { getSession, useSession } from "next-auth/client";
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
    width: "calc(100% + 32px)",
    fontSize: "1.5em",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "0 -16px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    "&:active": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },
}));

export default function OrgProject() {
  const [session, loading] = useSession();
  const [org] = useOrganization();
  const [project, setProject] = useProject();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return session ? (
    <>
      <AddDatasetModal
        onCreate={dataset => {
          insertDataset(org._id, project._id, dataset, () => {
            setProject({
              datasets: [...project.datasets, dataset],
              disableSave: true,
            });
            setOpen(false);
          });
        }}
        onCancel={() => setOpen(false)}
        open={open}
      />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Toolbar component={Paper}>
              {project?.name ? (
                <Input
                  className={classes.title}
                  disableUnderline={true}
                  defaultValue={name || project.name}
                  fullWidth
                  onBlur={e => {
                    setProject({ name: e.target.value });
                  }}
                />
              ) : (
                <Skeleton className={classes.title} width="100%" />
              )}
            </Toolbar>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader
                action={
                  <Button
                    onClick={() => setOpen(true)}
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
                    dataset.user == session.user.email ? (
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
  ) : loading ? null : (
    router.push("/login")
  );
}

const insertDataset = (oid, pid, dataset, callback) => {
  fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataset),
    }
  )
    .then(res => res.json())
    .then(res => callback(res.result));
};

OrgProject.Layout = ProjectLayout;
OrgProject.OrganizationProvider = OrganizationProvider;
OrgProject.ProjectProvider = ProjectProvider;
