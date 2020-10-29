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
import { Table, Button, Input } from "antd";
import "./index.less";

const columns = [
  {
    title: "序号",
    dataIndex: "sort",
  },
  {
    title: "项目名称",
    dataIndex: "project_name",
  },
  {
    title: "创建日期",
    dataIndex: "time",
  },
  {
    title: "分支",
    dataIndex: "branch",
  },
  {
    title: "diff结果",
    dataIndex: "result_info",
    render: (data) => {
      console.log("data===", data);
      return (
        <>
          {data.map((item, index) => {
            return (
              <Button key={index} type="primary" onClick={() => {}}>
                {index}
              </Button>
            );
          })}
        </>
      );
    },
  },
];

@withRouter
@autobind
class AllProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLists: [],
    };
  }

  componentDidMount() {
    this.getAllProjectsInfo();
  }

  getAllProjectsInfo = () => {
    fetch("/api/getAllProjects")
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        console.log("res", res);
        if (res.code === 0) {
          let len = res.data.length;
          for (let i = 0; i <= len - 1; i++) {
            res.data[i].sort = i;
            res.data[i].key = i;
          }
          res.data;
          this.setState({
            projectLists: res.data,
          });
        }
      });
  };

  renderBreadcrumb = () => <RightConBreadcrumb text="已有项目列表" />;

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

  renderForm = () => {
    const { projectLists } = this.state;
    return (
      <>
        <RightConSubTitle text="" />
        <div className="inputArea">
          <div className="sendReportItem">
            <Input
              className="sendReportItemSelect"
              placeholder="请填写项目名称"
              // defaultVal={task_name}
              onValueChange={() => {}}
            />
            <Button type="primary" onClick={() => {}}>
              搜索
            </Button>
          </div>
        </div>

        <RightConSubTitle text="" />
        <Table
          pagination={false}
          columns={columns}
          dataSource={projectLists}
          size="small"
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(AllProjects);
