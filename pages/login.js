import { createApi } from "unsplash-js";
import styled from "styled-components";
import { signIn } from "next-auth/client";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_KEY,
  fetch,
});

const Page = styled.div`
  background: url(${({photo}) => photo.urls.regular});
  height: 100vh;
  background-size: cover;
  background-position-y: center;
`

const LoginBox = styled.div`
  width: 33%;
  min-width: 300px;
  height: 100vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 0;
  background-color: #fefefe;
  box-shadow: 4px 0 16px rgb(0 0 0 / 50%);
  color: #121212;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 80%;
  min-width: 250px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 3em
`

const GoogleButton = styled.div`
  box-shadow: 2px 2px 4px rgb(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1em;
  cursor: pointer;
  transition-duration: 200ms;
  background-color: #FFF;

  &:hover {
    box-shadow: 2px 2px 4px rgb(0, 0, 0, 0.2);
  }
`

export default function Login({ photo }) {
  console.log(photo);

  return (
    <Page photo={photo}>
      <LoginBox>
        <Content>
          <h1>Annotator</h1>
          <GoogleButton onClick={() => signIn('google')}>
            Signin with Google
          </GoogleButton>
        </Content>
      </LoginBox>
    </Page>
  );
}

export async function getServerSideProps() {
  const photo = await unsplash.photos
    .getRandom({
      collectionIds: ["1369818", "1004513"],
    })
    .then((res) => {
      return res.response;
    });

  return { props: { photo } };
}
