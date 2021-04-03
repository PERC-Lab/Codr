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
import { useOrganization } from "../../OrganizationContext";
import { useProject } from "../../ProjectContext";
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
        <List>
          <ListSubheader>
            <ListItemText primary={project?.name} />
          </ListSubheader>
          <ListItem
            button
            key="Dashboard"
            onClick={() => router.push(`/${org?._id}/project/${project._id}`)}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListSubheader>
            <ListItemText primary="Datasets" />
          </ListSubheader>
          {project?.datasets.map(dataset =>
            dataset.user == session?.user.email ||
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
        </List>
      </div>
    </Drawer>
  );
}
