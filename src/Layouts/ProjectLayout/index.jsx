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
import { useRouter } from "next/router";
import { useOrganization } from "src/OrganizationContext";
import { useProject } from "src/ProjectContext";
import { Skeleton } from "@material-ui/lab";
import { useSession } from "next-auth/client";
import { Menu } from "@material-ui/icons";

const useStyles = ({ open }) =>
  makeStyles(theme => ({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      maxWidth: `calc(100% ${open ? '- 240px' : ''})`,
      transition: "225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function ProjectLayout({ children }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const [org] = useOrganization(router.query.oid);
  const [project] = useProject(router.query.oid, router.query.pid);
  const [drawerIsOpen, setDrawerIsOpen] = useState(true);
  const classes = useStyles({ open: drawerIsOpen })();

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
            &nbsp;/&nbsp;
            <Button
              variant="text"
              onClick={() =>
                router.push(`/${org?._id}/project/${project?._id}`)
              }
              disabled={!project}
            >
              {project?.name ? project.name : <Skeleton width={100} />}
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
