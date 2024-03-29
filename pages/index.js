import { BlankLayout } from "src/Layouts";
import styled from "styled-components";
import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { Add } from "@material-ui/icons";
import CreateOrgModal from "src/components/modals/CreateOrgModal";
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

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const [orgs, setOrgs] = useState([]);
  const router = useRouter();

  if (!status.sent) {
    getOrganizations().then(orgs => {
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
        ? orgs.map(org => (
            <Card key={org._id}>
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
        onCreate={name =>
          postOrganization(name, org => {
            setOrgs(o => {
              return [org, ...o];
            });
            setOpen(false);
          })
        }
      />
    </Container>
  );
}

const postOrganization = (name, callback) => {
  fetch(`/api/v1/organization`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then(res => res.json())
    .then(res => callback(res.result));
};

const getOrganizations = () => {
  return fetch(`/api/v1/organization`, {
    method: "GET",
    credentials: "same-origin",
  })
    .then(res => res.json())
    .then(res => res.result);
};

Home.Layout = BlankLayout;
