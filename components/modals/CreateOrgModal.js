import React, { useState } from "react";
import Modal from "./Modal";

export default function Modal() {
  const [visible, setVisibility] = useState(true);

  return (
    <Modal width={'400px'} visible={visible}>
      <form>
        <input name="name" />
        <input name="name" />
        <input name="name" />
      </form>
    </Modal>
  );
}
