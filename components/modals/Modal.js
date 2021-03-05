import React from "react";
import styled from "styled-components";

const ModalComponent = styled.div`
  display: ${({ visible } = visible ? "flex" : "none")};
  width: ${({ width }) => width};
`;

export default function Modal({ width, visible, children }) {
  return (
    <ModalComponent width={width} visible={visible}>
      {children}
    </ModalComponent>
  );
}
