import React from "react";
import Postcode from "@actbase/react-daum-postcode";
import Modal from "react-bootstrap/Modal";

function PostCodeModal({ show, handleClose, handleCompletePostCode }) {
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Postcode jsOptions={{ animation: true }} onSelected={(data) => handleCompletePostCode(data)}></Postcode>
      </Modal>
    </div>
  );
}

export default PostCodeModal;
