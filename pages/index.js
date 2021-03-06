import { BlankLayout } from "../src/Layouts";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { Add } from "@material-ui/icons";
import CreateOrgModal from "../components/modals/CreateOrgModal";
import { useState } from "react";
import { useRouter } from "next/router";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 1em 2em;
  gap: 1em;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Title = styled.h2`
  grid-column: span 4;
`;

const AddCard = styled(Card)`
  border: 2px dashed ${({ theme }) => theme.text};
  font-size: 2em;
  opacity: 75%;
  position: relative;
  font-weight: 200;

  &:hover {
    box-shadow: 2px 2px 4px rgba(0 0 0 / 10%);
  }
`;

const useStyles = makeStyles({
  card: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "100%",
  },
  center: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
});
export default function Home({ session }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const [orgs, setOrgs] = useState([]);
  const router = useRouter();

  if (!status.sent) {
    getOrganizations().then((orgs) => {
      setOrgs(orgs);
      setStatus(({ sent }) => {
        return { sent, recieved: true };
      });
    });
    setStatus(({ recieved }) => {
      return { sent: true, recieved };
    });
  }

  return (
    <Container>
      <Title>Organizations:</Title>
      {status.recieved
        ? orgs.map((org) => (
            <Card>
              <CardActionArea
                className={classes.card}
                onClick={() => {
                  router.push(`/${org._id}`);
                }}
              >
                <Typography variant="h5">{org.name}</Typography>
              </CardActionArea>
            </Card>
          ))
        : new Array(3).map(() => {
            <Skeleton variant="rect" width="100%" height="100%" />;
          })}
      <AddCard>
        <CardActionArea className={classes.card} onClick={() => setOpen(true)}>
          <span className={classes.center}>
            <Add />
            <br />
            <Typography variant="h6">Add</Typography>
          </span>
        </CardActionArea>
      </AddCard>
      <CreateOrgModal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onCreate={(name) => postOrganization(name, setOpen)}
      />
    </Container>
  );
}

const postOrganization = (name, setOpen) => {
  fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organizations`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => res.json())
    .then((doc) => {
      setOpen(false);
    });
};

const getOrganizations = () => {
  return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organizations`, {
    method: "GET",
    credentials: "same-origin",
  })
    .then((res) => res.json())
    .then((res) => res.result);
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

Home.Layout = BlankLayout;
