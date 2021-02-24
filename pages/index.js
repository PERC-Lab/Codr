import Head from "next/head";
import { BlankLayout } from "../src/Layouts";
import { getSession } from "next-auth/client";
import styled from "styled-components";

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

const Card = styled.div`
  height: 150px;
  border: 2px dashed ${({theme}) => theme.text};
  border-radius: 8px;
  font-size: 2em;
  opacity: 50%;
  transition: 200ms;
  position: relative;
  font-weight: 200;

  &:hover {
    opacity: 100%;
    box-shadow: 2px 2px 4px rgba(0 0 0 / 10%);
  }
`

const Middle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  & > div {
    font-size: 16px;
  }
`

export default function Home({session}) {
  console.log(session)
  return (
    <Container>
      <Title>Organizations:</Title>
      <Card>
        <Middle>
          +
          <div>Add</div>
        </Middle>
      </Card>
    </Container>
  );
}

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({req});

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
