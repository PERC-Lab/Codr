import { createApi } from "unsplash-js";
import styled from "styled-components";
import { getSession, signIn } from "next-auth/client";
import { Blurhash } from "react-blurhash";
import { Img } from "react-image";
import { Button, Paper } from "@material-ui/core";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_KEY,
  fetch,
});

const Page = styled.div`
  // background: url(${({ photo }) => photo.urls.full});
  height: 100vh;
`;

const LoginBox = styled(Paper)`
  width: 33%;
  min-width: 300px;
  height: 100vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 0;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 80%;
  min-width: 250px;
  max-width: 300px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 3em;
`;

const Attribute = styled.a`
  color: #ffffff;
  text-shadow: 0 0 8px black;
  position: absolute;
  bottom: 1em;
  left: 1em;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Image = styled(Img)`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

export default function Login({ photo, ...props }) {
  // console.log(props);

  return (
    <Page photo={photo}>
      <Image
        src={photo.urls.full}
        loader={<Blurhash hash={photo.blur_hash} width="100%" height="100vh" />}
      />
      <LoginBox square>
        <Content>
          <h1>Annotator</h1>
          <Button variant="contained" onClick={() => signIn("google")}>
            Signin with Google
          </Button>
        </Content>
      </LoginBox>
      <Attribute href={photo.links.html} target="_BLANK">
        Photo by {photo.user.name}
        <br />
        on Unsplash
      </Attribute>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  // console.log(req);

  if (session) {
    // If user, redirect to dashboard
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const photo = await unsplash.photos
    .getRandom({
      collectionIds: ["23354607"],
    })
    .then((res) => {
      return res.response;
    });

  return { props: { photo } };
}
