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
  title: {
    flex: "1 1 100%",
  },
}));

export default function OrgMembers({ session }) {
  const [org, dispatch] = useOrganization();
  const classes = useToolbarStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddMemberModal
        onCreate={(member) => {
          postMember(org._id, member, (nMember) => {
            dispatch({
              members: [nMember, ...org.members],
              ...org,
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
          <Button onClick={() => setOpen(true)} color="primary" variant="contained">
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
OrgMembers.OrganizationProvider = OrganizationProvider;
