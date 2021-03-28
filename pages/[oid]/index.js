import { OrgLayout } from "../../src/Layouts";
import {
  Button,
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
import AddProjectModal from "../../components/modals/AddProjectModal";

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}));

export default function Organization() {
  const router = useRouter();
  const [org] = useOrganization();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const classes = useStyles();

  if (!status.sent && org) {
    getProjects(org._id).then(projects => {
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
      <AddProjectModal
        onCreate={project => {
          createProject(org._id, project).then(nProject => {
            setProjects([...projects, nProject]);
            setOpen(false);
          });
        }}
        onCancel={() => setOpen(false)}
        open={open}
      />
      <Typography>Welcome{org?.name ? `, ${org.name}` : ""}!</Typography>
      <br />
      <Paper>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            Projects:
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add
          </Button>
        </Toolbar>
        <List>
          {projects.map(project => (
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

const getProjects = oid => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project`,
    {
      method: "GET",
    }
  )
    .then(res => res.json())
    .then(res => res.result);
};

/**
 *
 * @param {String} oid Organization Id
 * @param {{name: String, guidelines: String}} project Project details
 */
const createProject = (oid, project) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    }
  )
    .then(res => res.json())
    .then(res => res.result);
};

Organization.Layout = OrgLayout;
Organization.OrganizationProvider = OrganizationProvider;
