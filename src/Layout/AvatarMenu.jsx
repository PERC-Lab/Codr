import React from "react";
import styled from "styled-components";
import { signIn, signOut, useSession } from 'next-auth/client';

const Component = styled.div`
  display: grid;
  grid-template-columns: 40px auto;
  column-gap: 0.5em;
  align-items: center;
  margin: 0 1em;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({picture}) => picture ? `url(${picture})` : "#ccc"};
`

export default function AvatarMenu() {
  const [ session ] = useSession()

  return (
    <Component>
      {
        session?.user ? <>
          <Avatar picture={user?.picture} />
          {session.user.name} <br/>
          <button onClick={() => signOut('google')}>Sign out</button>
        </> : <> 
          Not signed in <br/>
          <button onClick={() => signIn('google')}>Sign in</button>
        </>
      }
    </Component>
  );
}
