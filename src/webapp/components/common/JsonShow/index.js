import React from "react";
import { connect } from "react-redux";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import { Input, Button } from "antd";
const { TextArea } = Input;
import prettyHtml from "json-pretty-html";
import styles from "./index.less";

function JsonShow(props) {
  const { jsonStr = "", json, onJsonChange, title = "" } = props;
  return (
    <>
      <RightConSubTitle text={title} />
      <div className={styles.jsonEdit}>
        <TextArea
          style={{ width: "50%", borderBottomLeftRadius: "5px" }}
          allowClear
          onChange={onJsonChange}
          value={jsonStr}
          className={styles.textAreaDiv}
        ></TextArea>
        <div
          className={styles.jsonShow}
          dangerouslySetInnerHTML={{
            __html: json === "" ? "" : prettyHtml(json),
          }}
        ></div>
      </div>
      <div className={styles.bottomBtn}>
        <Button
          type="primary"
          style={{ borderRadius: "5px", marginLeft: "20px" }}
        >
          提交
        </Button>
      </div>
    </>
  );
}

export default connect((state, dispatch) => ({
  dispatch,
}))(JsonShow);
