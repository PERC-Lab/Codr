import { ProjectLayout } from "../../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../src/ProjectContext";
import MarkdownEditor from "../../../src/MarkdownEditor";
import { MoreVert } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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

export default function OrgProject({ session }) {
  const [org] = useOrganization();
  const [project, setProject] = useProject();
  const classes = useStyles();

  return (
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
                onBlur={(e) => {
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
                <Button variant="contained" color="primary">Add</Button>
              }
              title="Datasets"
            />
            <CardContent>
              <List>
                <ListItem button disabled>
                  <ListItemText>Dataset One</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Dataset Two</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Dataset Three</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Dataset Four</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Dataset Five</ListItemText>
                </ListItem>
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
                onUpdate={(e) => {
                  setProject({ guidelines: e.target.value });
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (!session) {
    // If no user, redirect to login
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If there is a user, return the current session
  return { props: { session } };
}

OrgProject.Layout = ProjectLayout;
OrgProject.OrganizationProvider = OrganizationProvider;
OrgProject.ProjectProvider = ProjectProvider;
