import React from "react";
import styled from "styled-components";
import AppBar from "./AppBar";
import { appBarHeight } from "./constants";

const GridLayout = styled.div`
  display: grid;
  grid-template-rows: ${appBarHeight} auto;
  grid-template-columns: auto;
`;

export default function BlankLayout({ children, darkMode }) {
  return (
    <GridLayout>
      <AppBar darkMode={darkMode} />
      <div>{children}</div>
    </GridLayout>
  );
}
