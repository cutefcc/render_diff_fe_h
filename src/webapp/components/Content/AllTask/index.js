import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import * as R from "ramda";
import fetch from "cross-fetch";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import Pagination from "commonComponents/Pagination";
import RightConSubTitle from "commonComponents/RightConSubTitle";
// import SearchInput from "commonComponents/SearchInput";
import * as actions from "store/actions";
import { Table, Button, Input } from "antd";
import "./index.less";

@withRouter
@autobind
class allTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLists: [], // 所有的数据
      showLists: [], // 显示的列表数据
      page: 1,
      size: 10,
      columns: [
        {
          title: "序号",
          dataIndex: "sort",
        },
        {
          title: "项目名称",
          dataIndex: "project_name",
        },
        {
          title: "分支",
          dataIndex: "branch",
        },
        {
          title: "task_id",
          dataIndex: "task_id",
        },
        {
          title: "创建日期",
          dataIndex: "time",
        },
        {
          title: "diff结果",
          dataIndex: "if_successed",
          render: (if_successed) => {
            return (
              <>
                {if_successed ? (
                  <span style={{ color: "green" }}>通过</span>
                ) : (
                  <span style={{ color: "red" }}>不通过</span>
                )}
              </>
            );
          },
        },
        {
          title: "查看详情",
          dataIndex: "task_id",
          render: (task_id) => {
            return (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("---data---", task_id);
                    this.props.history.push(`/handleDiff?task_id=${task_id}`);
                  }}
                >
                  查看详情
                </Button>
              </>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.getAllTaskInfo();
  }

  getAllTaskInfo = () => {
    const { size } = this.state;
    fetch("/api/getAllTask")
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
          this.setState({
            projectLists: res.data,
            showLists: res.data.slice(0, size),
          });
        }
      });
  };

  renderBreadcrumb = () => <RightConBreadcrumb text="任务列表" />;

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

  handlePageChange = (page, size) => {
    const { projectLists } = this.state;
    const showLists = projectLists.slice(
      size * (page - 1),
      size * (page - 1) + size
    );
    this.setState({
      page,
      size,
      showLists,
    });
  };

  renderForm = () => {
    const { projectLists, page, size, showLists, columns } = this.state;
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
          dataSource={showLists}
          size="small"
        />
        <Pagination
          total={projectLists.length}
          pageSize={size}
          current={page}
          onChange={this.handlePageChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(allTask);
