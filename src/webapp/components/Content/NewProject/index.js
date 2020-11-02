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

  componentDidMount() {}

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

  btnClick = () => {
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
        console.log("resp", res);
        if (res.code === 0) {
          message.success("部署中");
          this.setState({
            projectName: "",
            branch: "",
          });
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
            <Button type="primary" onClick={this.btnClick}>
              部署环境
            </Button>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="rightCon sendReport">
        {this.renderBreadcrumb()}
        {this.renderForm()}
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
