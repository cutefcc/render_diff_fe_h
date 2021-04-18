import React, { useState, useEffect, useRef } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { getUrlParams } from "utils/index";
import * as actions from "store/actions";
import { withRouter } from "react-router-dom";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import ShowJson from "commonComponents/ShowJson";
import { Table, Button, Input } from "antd";
import styles from "./index.less";

export default withRouter(function DataDiff() {
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      ...state,
    };
  });
  const { json1, json2 } = state;
  useEffect(() => {
    const containerLeft = document.getElementById("containerLeft");
    const containerRight = document.getElementById("containerRight");
    let jsonLeft = json1;
    let jsonRight = json2;
    function onClassName({ path, field, value }) {
      const leftValue = _.get(jsonRight, path);
      const rightValue = _.get(jsonLeft, path);

      return _.isEqual(leftValue, rightValue)
        ? "the_same_element"
        : "different_element";
    }

    const optionsLeft = {
      mode: "tree",
      modes: ["code", "form", "text", "tree", "view", "preview"],
      onError: function (err) {
        alert(err.toString());
      },
      onClassName: onClassName,
      onChangeJSON: function (j) {
        jsonLeft = j;
        window.editorRight.refresh();
      },
    };

    const optionsRight = {
      mode: "tree",
      modes: ["code", "form", "text", "tree", "view", "preview"],
      onError: function (err) {
        alert(err.toString());
      },
      onClassName: onClassName,
      onChangeJSON: function (j) {
        jsonRight = j;
        window.editorLeft.refresh();
      },
    };

    window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft);
    window.editorRight = new JSONEditor(
      containerRight,
      optionsRight,
      jsonRight
    );
    window.editorLeft.expandAll();
    window.editorRight.expandAll();
  }, [json1, json2]);

  const test = () => {
    dispatch(actions.changeLeftNavStatus(true));
  };

  const renderBreadcrumb = () => (
    <RightConBreadcrumb onClick={test} text="数据对比" />
  );

  return (
    <div className={`${styles.rightCon}`}>
      {renderBreadcrumb()}
      <div className={styles.datadiffContainer}>
        <div
          className={styles.leftContainer}
          id="containerLeft"
          style={{ height: "600px" }}
        ></div>
        <div
          className={styles.rightContainer}
          id="containerRight"
          style={{ height: "600px" }}
        ></div>
      </div>
    </div>
  );
});
