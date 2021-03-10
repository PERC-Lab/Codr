import { ProjectLayout } from "../../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../src/ProjectContext";
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
}));

export default function OrgProject({ session }) {
  const [org] = useOrganization();
  const [project] = useProject();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Toolbar component={Paper}>
            <Typography variant="h6">{project?.name}</Typography>
          </Toolbar>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <MoreVert />
                </IconButton>
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
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <MoreVert />
                </IconButton>
              }
              title="Guidelines"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Guidelines will appear in this card component.
              </Typography>
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
