import React, { useState } from "react";
import styled from "styled-components";

/* 
  This code is based off W3Schools' "How TO - Toggle Switch" Tutorial/Example
  Link: https://www.w3schools.com/howto/howto_css_switch.asp
*/

const SwitchComponent = styled.label`
  position: relative;
  display: inline-block;
  width: ${({ height }) => height * 2}px;
  height: ${({ height }) => height}px;
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked {
    background-color: #2196f3;
    -webkit-transform: translateX(${({ height }) => height}px);
    -ms-transform: translateX(${({ height }) => height}px);
    transform: translateX(${({ height }) => height}px);
  }

  &:focus {
    box-shadow: 0 0 1px #2196f3;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 200ms;
  transition: 200ms;
  border-radius: ${({ height }) => height}px;

  ${({ isActive }) => isActive && `background-color: #2196F3;`}

  &:before {
    position: absolute;
    content: "";
    height: ${({ height }) => Math.round(height * 0.6)}px;
    width: ${({ height }) => Math.round(height * 0.6)}px;
    left: ${({ height }) => Math.round(height * 0.2)}px;
    bottom: ${({ height }) => Math.round(height * 0.2)}px;
    background-color: white;
    -webkit-transition: 200ms;
    transition: 200ms;
    border-radius: 50%;

    ${({ isActive, height }) =>
      isActive &&
      `
      -webkit-transform: translateX(${height}px);
      -ms-transform: translateX(${height}px);
      transform: translateX(${height}px);
    `}
  }
`;

export default function Switch({ height, onChange, isActive, ...props }) {
  const [isAct, setAct] = useState(!!isActive);
  return (
    <SwitchComponent height={height} {...props}>
      <Checkbox
        type="checkbox"
        checked={isAct}
        onChange={() => {
          setAct(!isAct);
          onChange(!isAct);
        }}
        height={height}
      />
      <Slider isActive={isAct} height={height}></Slider>
    </SwitchComponent>
  );
}
