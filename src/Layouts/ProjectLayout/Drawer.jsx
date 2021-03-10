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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
          <ListItem button key="Dashboard" onClick={() => router.push(`/${org?._id}/project/${project._id}`)}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListSubheader>
            <ListItemText primary="Datasets" />
          </ListSubheader>
          <ListItem button key="Dataset One">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Dataset One" />
          </ListItem>
          <ListItem button key="Dataset Two">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Dataset Two" />
          </ListItem>
          <ListItem button key="Dataset Three">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Dataset Three" />
          </ListItem>
          <ListItem button key="Dataset Four">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Dataset Four" />
          </ListItem>
          <ListItem button key="Dataset Five">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Dataset Five" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
