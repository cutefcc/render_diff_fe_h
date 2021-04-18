import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import { Input, Button, Modal } from "antd";
const { TextArea } = Input;
import prettyHtml from "json-pretty-html";
import styles from "./index.less";

function ShowJson(props) {
  const { json = {}, onOk = () => {}, onCancel = () => {} } = props;
  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById("container");
      const options = {
        mode: "code",
        modes: ["code", "form", "text", "tree", "view", "preview"], // allowed modes
        onError: function (err) {
          alert(err.toString());
        },
      };
      if (container && window.JSONEditor) {
        const editor = new window.JSONEditor(container, options);
        editor.set(json);
      }
    }, 300);
  }, [json]);
  const handleOk = () => {
    onOk();
  };
  const handleCancel = () => {
    onCancel();
  };
  return (
    <Modal
      visible={true}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={680}
      closable={false}
    >
      <div id="container" style={{ height: "600px" }}></div>
    </Modal>
  );
}

export default connect((state, dispatch) => ({
  dispatch,
}))(ShowJson);
