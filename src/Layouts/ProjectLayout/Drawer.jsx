import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { Dashboard, Storage } from "@material-ui/icons";
import { useOrganization } from "src/OrganizationContext";
import { useProject } from "src/ProjectContext";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: "calc(100vh - 64px)",
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

export default function AppDrawer() {
  const [org] = useOrganization();
  const [project] = useProject();
  const classes = useStyles();
  const router = useRouter();
  const [session] = useSession();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      open={true}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List className={classes.list} subheader={<li />}>
          <li key={`section-${project?.name}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>{project?.name}</ListSubheader>
              <ListItem
                button
                key="Dashboard"
                onClick={() =>
                  router.push(`/${org?._id}/project/${project._id}`)
                }
              >
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </ul>
          </li>
          <li key={`section-datasets`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>Datasets</ListSubheader>
              {project?.datasets.map(dataset =>
                dataset.user.includes(session?.user.email) ||
                org.members.find(m => m.email === session.user.email).role ===
                  "admin" ? (
                  <ListItem
                    button
                    key={dataset.label}
                    onClick={() =>
                      router.push(
                        `/${org._id}/project/${project._id}/${dataset.label}`
                      )
                    }
                  >
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText primary={dataset.name} />
                  </ListItem>
                ) : null
              )}
            </ul>
          </li>
        </List>
      </div>
    </Drawer>
  );
}
