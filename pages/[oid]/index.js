import { OrgLayout } from "../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  OrganizationProvider,
  useOrganization,
} from "../../src/OrganizationContext";
import { useState } from "react";
import { Folder } from "@material-ui/icons";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
}));

export default function Organization({ session }) {
  const router = useRouter();
  const [org] = useOrganization();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const classes = useStyles();

  if (!status.sent && org) {
    getProjects(org._id).then((projects) => {
      setProjects(projects);
      setStatus(({ sent }) => {
        return { sent, recieved: true };
      });
    });
    setStatus(({ recieved }) => {
      return { sent: true, recieved };
    });
  }

  return (
    <>
      <Typography>Welcome{org?.name ? `, ${org.name}` : ""}!</Typography>
      <Paper>
        <Toolbar className={classes.title}>
          <Typography variant="h6">Projects:</Typography>
        </Toolbar>
        <List>
          {projects.map((project) => (
            <ListItem
              button
              onClick={() => router.push(`/${org._id}/project/${project._id}`)}
              key={project.name}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={project.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}

const getProjects = (oid) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => res.result);
};

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

Organization.Layout = OrgLayout;
Organization.OrganizationProvider = OrganizationProvider;
