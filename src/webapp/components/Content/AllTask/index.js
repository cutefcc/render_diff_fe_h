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
import styles from "./index.less";

@withRouter
@autobind
class AllTask extends React.Component {
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
          title: "任务名称",
          dataIndex: "project_name",
        },
        {
          title: "环境分支",
          dataIndex: "branch",
        },
        {
          title: "筛选条件",
          dataIndex: "qq",
        },
        {
          title: "测试环境",
          dataIndex: "qq",
        },
        {
          title: "对比环境",
          dataIndex: "qq",
          render: (status) => {
            return <>{status === 1 ? "正常" : "部署中"}</>;
          },
        },
        {
          title: "任务状态",
          dataIndex: "qq",
        },
        {
          title: "结果",
          dataIndex: "qq",
        },
        {
          title: "创建者",
          dataIndex: "qq",
        },
        {
          title: "创建日期",
          dataIndex: "qq",
        },
        {
          title: "操作",
          dataIndex: "task_id",
          render: (task_id) => {
            return (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    this.props.history.push(`/task_detail?task_id=${task_id}`);
                  }}
                >
                  查看
                </Button>
                <Button type="primary" onClick={() => {}}>
                  删除
                </Button>
                <Button type="primary" onClick={() => {}}>
                  更新环境
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
    const { page, size } = this.state;
    fetch(`/api/getAllTask?page_id=${page}&page_size=${size}`)
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.code === 0) {
          let len = res.data.data.length;
          let taskLists = [];
          taskLists.length = len;
          for (let i = 0; i <= len - 1; i++) {
            const [
              task_id,
              project_name,
              black_white_list,
              test_branch,
              master_env,
              test_env,
              status,
              time,
              flow_num,
            ] = res.data.data[i];
            taskLists[i] = {};
            taskLists[i].sort = i;
            taskLists[i].key = i;
            taskLists[i].task_id = task_id;
            taskLists[i].project_name = project_name;
            taskLists[i].black_white_list = black_white_list;
            taskLists[i].test_branch = test_branch;
            taskLists[i].master_env = master_env;
            taskLists[i].test_env = test_env;
            taskLists[i].status = status;
            taskLists[i].time = time;
            taskLists[i].flow_num = flow_num;
          }
          this.setState({
            // projectLists: taskLists,
            showLists: taskLists,
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
        <div className={styles.inputArea}>
          <div className={styles.sendReportItem}>
            <Input
              className={styles.sendReportItemSelect}
              placeholder="根据任务名称搜索"
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
      <div className={`${styles.rightCon} ${styles.sendReport}`}>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllTask);
