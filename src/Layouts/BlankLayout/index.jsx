import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import AvatarMenu from "./AvatarMenu";
import Drawer from "./Drawer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "#333",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ClippedDrawer({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Annotator
          </Typography>
          <AvatarMenu />
        </Toolbar>
      </AppBar>
      <Drawer />
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}
