import React from "react";
import styled from "styled-components";
import Switch from "../Switch";
import AvatarMenu from "./AvatarMenu";

const Component = styled.div`
  display: flex;
  grid-column: span 2;
  column-gap: 1em;
  align-items: center;
  padding: 0 1em;
  background-color: ${({ theme }) => theme.background};
  border-bottom: ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Title = styled.div`
  font-size: 1.5em;
`;

const RightSide = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1em;
`

export default function AppBar({ darkMode }) {
  const [mode, toggleMode] = darkMode;

  return (
    <Component>
      <Title>Annotator</Title>
      <RightSide>
        <Switch isActive={mode === "dark"} onClick={toggleMode} />
        <AvatarMenu />
      </RightSide>
    </Component>
  );
}
