import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { FolderOutlined, GroupOutlined } from "@material-ui/icons";
import { useOrganization } from "src/OrganizationContext";
import { useRouter } from "next/router";

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
  }));

export default function AppDrawer({ open }) {
  const [org] = useOrganization();
  const classes = useStyles({ open })();
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
          <ListItem
            button
            key="Projects"
            onClick={() => router.push(`/${org?._id}`)}
          >
            <ListItemIcon>
              <FolderOutlined />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="Members"
            onClick={() => router.push(`/${org?._id}/members`)}
          >
            <ListItemIcon>
              <GroupOutlined />
            </ListItemIcon>
            <ListItemText primary="Members" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
