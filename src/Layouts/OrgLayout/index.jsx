import React from "react";
import styled from "styled-components";
import AppBar from "./AppBar";
import { appBarHeight, drawerWidth } from "./constants";
import Drawer from "./Drawer";

const GridLayout = styled.div`
  display: grid;
  grid-template-rows: ${appBarHeight} auto;
  grid-template-columns: ${drawerWidth} auto;
`;

const Content = styled.div`
  // box-shadow: inset 4px 4px 8px -4px ${({ theme }) => theme.boxShadow};
`;

export default function OrgLayout({ children, darkMode }) {
  return (
    <GridLayout>
      <AppBar darkMode={darkMode} />
      <Drawer />
      <Content>{children}</Content>
    </GridLayout>
  );
}
