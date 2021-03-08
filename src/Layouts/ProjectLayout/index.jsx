import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import AvatarMenu from "./AvatarMenu";
import Drawer from "./Drawer";
import { useRouter } from "next/router";
import { useOrganization } from "../../OrganizationContext";
import { useProject } from "../../ProjectContext";
import { Skeleton } from "@material-ui/lab";

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

export default function ProjectLayout({ children }) {
  const router = useRouter();
  const [org] = useOrganization(router.query.orgId);
  const [project] = useProject(router.query.orgId, router.query.pid);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button variant="text" onClick={() => router.push('/')}>
              Annotator
            </Button>
            &nbsp;/&nbsp;
            <Button variant="text" onClick={() => router.push(`/${org?._id}`)} disabled={!org}>
              { org?.name ?  org.name : <Skeleton width={100} /> }
            </Button>
            &nbsp;/&nbsp;
            <Button variant="text" onClick={() => router.push(`/${project?._id}`)} disabled={!project}>
              { project?.name ?  project.name : <Skeleton width={100} /> }
            </Button>
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
