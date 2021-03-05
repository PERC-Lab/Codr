import { BlankLayout } from "../src/Layouts";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

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

  return (
    <Container>
      <Title>Organizations:</Title>
      <Card>
        <CardActionArea className={classes.card}>
          <Typography variant="h5">PERC_Lab</Typography>
        </CardActionArea>
      </Card>
      <AddCard>
        <CardActionArea className={classes.card}>
          <span className={classes.center}>
            <Add />
            <br />
            <Typography variant="h6">Add</Typography>
          </span>
        </CardActionArea>
      </AddCard>
    </Container>
  );
}

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
