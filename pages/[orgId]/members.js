import { OrgLayout } from "../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import {
  OrganizationProvider,
  useOrganization,
} from "../../src/OrganizationContext";
import AddMemberModal from "../../components/modals/AddMemberModal";
import { useState } from "react";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

export default function OrgMembers({ session }) {
  const classes = useToolbarStyles();
  const [org, dispatch] = useOrganization();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const router = useRouter();

  // simple statement to check if org is already initialized.
  if (!status.sent && !org) {
    getOrganization(router.query.orgId)
      .then((org) => {
        dispatch({ type: "set", payload: org });
        setStatus(({ sent }) => {
          return { sent, recieved: true };
        });
      })
      .catch((e) => console.error(e));
    setStatus(({ recieved }) => {
      return { sent: true, recieved };
    });
  }

  return (
    <>
      <AddMemberModal
        onCreate={(member) => {
          postMember(org._id, member, (nMember) => {
            dispatch({
              type: "set",
              payload: {
                members: [nMember, ...org.members],
                ...org,
              },
            });
            setOpen(false);
          });
        }}
        onCancel={() => setOpen(false)}
        open={open}
      />
      <Paper>
        <Toolbar className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Members
          </Typography>
          <Button onClick={() => setOpen(true)} color="primary">
            Add
          </Button>
        </Toolbar>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {org?.members
                ? org.members.map((row) => (
                    <TableRow key={row.email}>
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

const getOrganization = (oid) => {
  return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.result);
};

const postMember = (oid, member, callback) => {
  fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/member`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  })
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

OrgMembers.Layout = OrgLayout;
OrgMembers.Provider = OrganizationProvider;
