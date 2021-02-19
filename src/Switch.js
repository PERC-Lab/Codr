import React, { useState } from "react";
import styled from "styled-components";

/* 
  This code is based off W3Schools' "How TO - Toggle Switch" Tutorial/Example
  Link: https://www.w3schools.com/howto/howto_css_switch.asp
*/

const SwitchComponent = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked {
    background-color: #2196f3;
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
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
  border-radius: 34px;

  ${({ isActive }) =>
    isActive &&
    `
    background-color: #2196F3;
  `}

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 200ms;
    transition: 200ms;
    border-radius: 50%;

    ${({ isActive }) =>
      isActive &&
      `
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    `}
  }
`;

export default function Switch(props) {
  const [isActive, setActive] = useState(props.isActive);
  return (
    <SwitchComponent>
      <Checkbox
        type="checkbox"
        checked={isActive}
        onChange={() => {
          setActive(!isActive);
          props.onClick();
        }}
      />
      <Slider isActive={isActive}></Slider>
    </SwitchComponent>
  );
}
