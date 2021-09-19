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

const useStyles = ({ open }) =>
  makeStyles(theme => ({
    root: {
      display: "flex",
    },
    drawer: {
      width: open ? drawerWidth : 0,
      flexShrink: 0,
      transition: "225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    },
    drawerPaper: {
      width: open ? drawerWidth : 0,
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

export default function AppDrawer({ open }) {
  const [org] = useOrganization();
  const [project] = useProject();
  const classes = useStyles({ open })();
  const router = useRouter();
  const [session] = useSession();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      open={open}
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
                    key={dataset._id}
                    onClick={() =>
                      router.push(
                        `/${org._id}/project/${project._id}/${dataset._id}`
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
