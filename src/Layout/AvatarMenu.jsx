import React from "react";
import styled from "styled-components";
import { useUser } from "../../lib/useUser";

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
  const [user] = useUser();

  return (
    <Component>
      <Avatar picture={user?.picture} />
      {user?.displayName || "Jon Doe"}
    </Component>
  );
}
