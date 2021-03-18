import { ProjectLayout } from "../../../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../src/ProjectContext";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  card: {
    maxWidth: 345,
  },
  title: {
    width: "calc(100% + 32px)",
    fontSize: "1.5em",
    borderRadius: 4,
    padding: "4px 8px",
    margin: "0 -16px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    "&:active": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },
}));

export default function ProjectDataset({ session }) {
  const [org] = useOrganization();
  const [project] = useProject();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  console.log(project);

  return (
    <>
      <Typography>Hello</Typography>
    </>
  );
}

const insertDataset = (oid, pid, dataset, callback) => {
  fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataset),
    }
  )
    .then((res) => res.json())
    .then((res) => callback(res.result));
};

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (!session) {
    // If no user, redirect to login
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If there is a user, return the current session
  return { props: { session } };
}

ProjectDataset.Layout = ProjectLayout;
ProjectDataset.OrganizationProvider = OrganizationProvider;
ProjectDataset.ProjectProvider = ProjectProvider;
