import React from "react";
import styled from "styled-components";
import { appBarHeight } from "./constants";

const Component = styled.div`
  display: grid;
  grid-auto-rows: 2em;
  row-gap: 1em;
  align-items: center;
  padding: 1em;
  height: calc(100vh - ${appBarHeight});
  // background-color: ${({ theme }) => theme.background};
  border-right: ${({ theme }) => theme.border};
  position: sticky;
  top: ${appBarHeight};
  left: 0;
`;

const NavLink = styled.a`
  align-items: center;
  padding: 0 1em;
`;

export default function Drawer() {
  return (
    <Component>
      <NavLink>Dashboard</NavLink>
      <NavLink>Projects</NavLink>
      <NavLink>Account</NavLink>
      <NavLink>Settings</NavLink>
    </Component>
  );
}
