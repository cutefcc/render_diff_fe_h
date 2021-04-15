import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import * as R from "ramda";
import fetch from "cross-fetch";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import RightConSubTitle from "commonComponents/RightConSubTitle";
// import SearchInput from "commonComponents/SearchInput";
import * as actions from "store/actions";
import { Input, Button, message } from "antd";
// import jsoneditor from "jsoneditor";
import "./index.less";

@withRouter
@autobind
class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      branch: "",
    };
  }

  componentDidMount() {
    const containerLeft = document.getElementById("containerLeft");
    const containerRight = document.getElementById("containerRight");

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

    let jsonLeft = {
      arrayOfArrays: [1, 2, 999, [3, 4, 5]],
      someField: true,
      boolean: true,
      htmlcode: "&quot;",
      escaped_unicode: "\\u20b9",
      unicode: "\u20b9,\uD83D\uDCA9",
      return: "\n",
      null: null,
      thisObjectDoesntExistOnTheRight: { key: "value" },
      number: 123,
      object: { a: "b", new: 4, c: "d", e: [1, 2, 3] },
      string: "Hello World",
      url: "http://jsoneditoronline.org",
      "[0]": "zero",
    };

    let jsonRight = {
      arrayOfArrays: [1, 2, [3, 4, 5]],
      boolean: true,
      htmlcode: "&quot;",
      escaped_unicode: "\\u20b9",
      thisFieldDoesntExistOnTheLeft: "foobar",
      unicode: "\u20b9,\uD83D\uDCA9",
      return: "\n",
      null: null,
      number: 123,
      object: { a: "b", c: "d", e: [1, 2, 3] },
      string: "Hello World",
      url: "http://jsoneditoronline.org",
      "[0]": "zero",
    };

    window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft);
    window.editorRight = new JSONEditor(
      containerRight,
      optionsRight,
      jsonRight
    );
  }

  renderBreadcrumb = () => <RightConBreadcrumb text="新建项目" />;

  handleProjectNameChange = (e) => {
    this.setState({
      projectName: e.target.value,
    });
  };

  handleBranchChange = (e) => {
    this.setState({
      branch: e.target.value,
    });
  };

  deployBtnClick = () => {
    const { projectName, branch } = this.state;
    fetch("/api/newProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName,
        branch,
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.code === 0) {
          message.success(res.data);
          this.setState({
            projectName: "",
            branch: "",
          });
        } else {
          message.warn(res.data);
        }
      });
  };

  renderForm = () => {
    const { projectName, branch } = this.state;
    return (
      <>
        <RightConSubTitle text="" />
        <div className="inputArea">
          <div className="sendReportItem">
            <span className="inputText">项目名称</span>
            <Input
              placeholder=""
              value={projectName}
              onChange={this.handleProjectNameChange}
              className="sendReportItemSelect"
            />
          </div>
          <div className="sendReportItem">
            <span className="inputText">环境分支</span>
            <Input
              placeholder=""
              value={branch}
              onChange={this.handleBranchChange}
              className="sendReportItemSelect"
            />
          </div>
          <div
            ref={(dom) => (this.bottomDiv = dom)}
            style={{ height: "0px", overflow: "hidden" }}
          ></div>
          <div style={{ marginLeft: "88px", marginTop: "10px" }}>
            <Button
              type="primary"
              onClick={this.deployBtnClick}
              style={{ marginRight: "20px" }}
            >
              部署环境
            </Button>
            <Button type="primary">更新环境</Button>
          </div>
        </div>
      </>
    );
  };

  renderJsonEditor = () => {
    return (
      <div id="wrapper">
        <div id="containerLeft"></div>
        <div id="containerRight"></div>
      </div>
    );
  };

  render() {
    return (
      <div className="rightCon sendReport">
        {this.renderBreadcrumb()}
        {this.renderForm()}
        {this.renderJsonEditor()}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    ...state,
  };
};
let mapDispatchToProps = (dispatch) => {
  return {
    setEnvLists: (envLists) => {
      dispatch(actions.setEnvLists(envLists));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
