import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import AvatarMenu from "./AvatarMenu";
import { useSession } from "next-auth/client";

const useStyles = makeStyles(theme => ({
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
  const [session, loading] = useSession();
  const router = useRouter();
  const classes = useStyles();

  return session ? (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Annotator
          </Typography>
          <AvatarMenu />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  ) : loading ? null : (
    router.push("/login")
  );
}
