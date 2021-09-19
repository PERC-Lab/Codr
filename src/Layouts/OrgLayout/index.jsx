import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AvatarMenu from "./AvatarMenu";
import Drawer from "./Drawer";
import { useOrganization } from "src/OrganizationContext";
import { useRouter } from "next/router";
import { Skeleton } from "@material-ui/lab";
import { useSession } from "next-auth/client";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function OrgLayout({ children }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const [org] = useOrganization(router.query.oid);
  const [drawerIsOpen, setDrawerIsOpen] = useState(true);
  const classes = useStyles();

  return session ? (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setDrawerIsOpen(!drawerIsOpen);
            }}
            edge="start"
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Button variant="text" onClick={() => router.push("/")}>
              Annotator
            </Button>
            &nbsp;/&nbsp;
            <Button
              variant="text"
              onClick={() => router.push(`/${org?._id}`)}
              disabled={!org}
            >
              {org?.name ? org.name : <Skeleton width={100} />}
            </Button>
          </Typography>
          <AvatarMenu />
        </Toolbar>
      </AppBar>
      <Drawer open={drawerIsOpen} />
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  ) : loading ? null : (
    router.push("/login")
  );
}
