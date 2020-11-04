import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import * as R from "ramda";
import fetch from "cross-fetch";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import { senceConfig, productsConfig } from "constants/index";
import { getUrlParams } from "utils/index";
// import SearchInput from "commonComponents/SearchInput";
import * as actions from "store/actions";
import { Table, Radio, Select, Input, Button, Modal } from "antd";
// import {RollbackOutlined} from '@ant-design/icons';
const { Option } = Select;
import "./index.less";
const downloadTypeEadioOptions = [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
];
const selectMethodRadioOptions = [
  { label: "包含", value: "yes" },
  { label: "不包含", value: "no" },
];
const renderSenceOptions = () => {
  return senceConfig.map((item) => {
    return <Option key={item.value}>{item.label}</Option>;
  });
};
const renderProductsOptions = () => {
  return productsConfig.map((item) => {
    return <Option key={item.value}>{item.label}</Option>;
  });
};

@withRouter
@autobind
class HandleDiff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLists: [],
      downloadType: "yes",
      selectMethod: "yes",
      urlParams: {},
      hasTaskId: false,
      page: 0,
      size: 10,
      diffResultList: [], // diff_result 返回的列表
      visible: false, // 对比结果弹窗
      json_master: {}, // json
      json_test: {}, //
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
          title: "筛选方式",
          dataIndex: "is_filtered",
          render: (is_filtered) => {
            return <>{is_filtered === "include" ? "包含" : "不包含"}</>;
          },
        },
        {
          title: "筛选条件",
          dataIndex: "all",
          render: (all) => {
            return (
              <>
                {all.is_filtered === "include"
                  ? JSON.stringify(all.white_list)
                  : JSON.stringify(all.black_list)}
              </>
            );
          },
        },
        {
          title: "请求信息",
          dataIndex: "result",
          render: (result) => {
            return <>{JSON.stringify(result.in_params)}</>;
          },
        },
        {
          title: "操作",
          dataIndex: "all",
          render: (all) => {
            return (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    this.setState({
                      visible: true,
                      json_master: all.result.json_master,
                      json_test: all.result.json_test,
                    });
                  }}
                >
                  对比结果
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
    this.handleHasTaskId();
  }

  handleHasTaskId = () => {
    const urlObj = getUrlParams();
    if (urlObj.task_id) {
      this.handleGetDiffResult(urlObj.task_id);
      this.setState({
        hasTaskId: true,
      });
    }
  };

  handleGetDiffResult = (task_id) => {
    const { size } = this.state;
    fetch(`/api/getDiffResult?task_id=${task_id}&page_id=0&page_size=${size}`)
      .then((resp) => {
        return resp.json();
      })
      .then((res = {}) => {
        console.log("res=====", res);
        const {
          code,
          data: { list },
        } = res;
        for (let i = 0; i <= list.length - 1; i++) {
          list[i].sort = i;
          list[i].key = i;
          list[i].all = list[i];
        }
        if (code === 0) {
          this.setState({
            diffResultList: list,
          });
        }
      });
  };

  getAllTaskInfo = () => {
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
          res.data;
          this.setState({
            projectLists: res.data,
          });
        }
      });
  };

  renderBreadcrumb = () => (
    <RightConBreadcrumb
      text={this.state.hasTaskId ? "任务列表 / 详情" : "任务列表"}
    />
  );

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

  handleDownLoadTypeChange = (e) => {
    this.setState({
      downloadType: e.target.value,
    });
  };

  handleSelectMethodChange = (e) => {
    this.setState({
      selectMethod: e.target.value,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  renderForm = () => {
    const { downloadType, selectMethod } = this.state;
    return (
      <>
        <RightConSubTitle text="" />
        <div className="inputArea">
          <div className="sendReportItem">
            <span className="inputText">从已有项目选择</span>
            <Select
              defaultValue="Sfst"
              onChange={() => {}}
              className="sendReportItemSelect"
              // value={"1"}
            >
              {renderProductsOptions()}
            </Select>
          </div>
        </div>
        <RightConSubTitle text="筛选条件" />
        <div className="inputArea">
          <div className="sendReportItem">
            <span className="inputText">场景</span>
            <Select
              defaultValue="mainfeed"
              onChange={() => {}}
              className="sendReportItemSelect"
              // value={"1"}
            >
              {renderSenceOptions()}
            </Select>
          </div>
          <div className="sendReportItem">
            <span className="inputText">产品线</span>
            <Select
              defaultValue="Sfst"
              onChange={() => {}}
              className="sendReportItemSelect"
              // value={"1"}
            >
              {renderProductsOptions()}
            </Select>
          </div>
          <div className="sendReportItem">
            <span className="inputText">下载类型</span>
            <Radio.Group
              options={downloadTypeEadioOptions}
              onChange={this.handleDownLoadTypeChange}
              value={downloadType}
            />
          </div>
          <div className="sendReportItem">
            <span className="inputText">筛选方式</span>
            <Radio.Group
              options={selectMethodRadioOptions}
              onChange={this.handleSelectMethodChange}
              value={selectMethod}
            />
          </div>

          <div className="sendReportItem">
            <span className="inputText">自定义</span>
            <Input
              className="sendReportItemSelect"
              placeholder="检索条件"
              // defaultVal={task_name}
              onValueChange={() => {}}
            />
          </div>
          <div className="sendReportItem">
            <Button type="primary" onClick={() => {}}>
              开始对比
            </Button>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { hasTaskId, diffResultList, columns } = this.state;
    console.log("diffResultList.length", diffResultList.length);
    return (
      <div className="rightCon sendReport">
        {this.renderBreadcrumb()}
        {!hasTaskId && this.renderForm()}
        {/* {hasTaskId && <Button type="primary" style={{margin: '20px 0 20px 0'}}>返回任务列表</Button>} */}
        {hasTaskId && (
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              marginBottom: "10px",
              marginTop: "-28px",
            }}
          >
            <Button
              size={"small"}
              type="primary"
              style={{ margin: "0 0 10px 0" }}
              onClick={() => {
                this.props.history.push(`/allTask`);
              }}
            >
              返回
            </Button>
          </div>
        )}
        {hasTaskId && (
          <Modal
            title="对比结果"
            width={1000}
            maskClosable={false}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        )}
        {diffResultList.length > 0 && (
          <Table
            pagination={false}
            columns={columns}
            dataSource={diffResultList}
            size="small"
          />
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(HandleDiff);
