import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as R from "ramda";
import fetch from "cross-fetch";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import JsonDiffJsx from "commonComponents/JsonDiffJsx";
import DiffResultList from "commonComponents/DiffResultList";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import {
  senceConfig,
  productsConfig,
  interfaceConfig,
  optimizationObjectiveConfig,
  promotionObjectiveConfig,
} from "constants/index";
import { getUrlParams } from "utils/index";
import * as actions from "store/actions";
import { Radio, Select, Input, Button, Modal, message } from "antd";
import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";
import styles from "./index.less";
const { Option } = Select;
const downloadTypeEadioOptions = [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
  { label: "不限", value: "noLimit" },
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
const renderOptimizationObjectiveOptions = () => {
  return optimizationObjectiveConfig.map((item) => {
    return <Option key={item.value}>{item.label}</Option>;
  });
};
const renderPromotionObjectiveOptions = () => {
  return promotionObjectiveConfig.map((item) => {
    return <Option key={item.value}>{item.label}</Option>;
  });
};
const renderInterfaceOptions = () => {
  return interfaceConfig.map((item) => {
    return <Option key={item.value}>{item.label}</Option>;
  });
};

@withRouter
@autobind
class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLists: [],
      downloadType: "noLimit",
      selectMethod: "yes",
      urlParams: {},
      page: 0,
      size: 10,
      diffResultList: [], // diff_result 返回的列表
      visible: false, // 对比结果弹窗
      json_master: {}, // json
      json_test: {}, //
      modalWidth: 1000,
      modalHeight: 1000,
      hiddenFilter: false,
      diffResultTotal: {},
      diffResStyle: {
        a: {
          background: "rgba(151,234,151,.6)",
          color: "#000",
        },
        m: {
          background: "#f60",
          color: "#000",
          opacity: "0.5",
        },
        d: {
          textDecoration: "line-through",
          color: "red",
          fontWeight: "bold",
        },
      },
      json1: {
        q: 1,
        w: 1,
        arr: [
          {
            a: 1,
            b: 2,
            c:
              "fdfdfdfdfdfdfdfdfdfdfdfdfdkkkkkkkkkjdjdjjdjdjdjdjdjdjdjjddj11111",
          },
          {
            a: 4,
            b: 5,
            c: 6,
          },
        ],
        a: {
          b: 1,
        },
        b: [],
        c: {},
      },
      json2: {
        w: 2,
        arr: [{ a: 12, b: 2, d: 234 }],
        a: {
          b: 1,
          c: {
            name: "333",
          },
        },
        b: {
          c: 3,
        },
        www: {
          is: "a dog",
          d: 123,
          ddd: "12345654",
          ddd1: "12345654",
          ddd2: "12345654",
          ddd3: "12345654",
          ddd4: "12345654",
          ddd5: "12345654",
          ddd6: "12345654",
          ddd7: "12345654",
          ddd8: "12345654",
          ddd9: "12345654",
          ddd10: "12345654",
        },
        c: {
          e: 4,
        },
        d: {
          e: 34,
        },
        tt: {
          d: [
            1,
            2,
            3,
            4,
            5,
            {
              a: {
                ddd:
                  "fdfdfdfdfdfdfdfdfdfdfdfdfdkkkkkkkkkjdjdjjdjdjdjdjdjdjdjjddj11111",
              },
            },
          ],
        },
      },
    };
  }

  componentDidMount() {
    this.setModalWidthHeight();
    this.getDiffResultTotal();
  }

  setModalWidthHeight = () => {
    const w = R.pathOr(1000, ["document", "body", "clientWidth"], window);
    const h = R.pathOr(1000, ["document", "body", "clientHeight"], window);
    this.setState({
      modalWidth: w,
      modalHeight: h,
    });
  };

  handleNewTask = () => {
    fetch("/api/new_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // projectName,
        // branch,
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.code === 0) {
          console.log("909090909");
        }
      });
  };

  handleGetDiffResult = (task_id) => {
    const { size } = this.state;
    fetch(`/api/getDiffResult?task_id=${task_id}&page_id=0&page_size=${size}`)
      .then((resp) => {
        return resp.json();
      })
      .then((res = {}) => {
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

  getDiffCount = (task_id, page_id, res_type) => {
    fetch(
      `/api/getDiffTypeResult?task_id=${task_id}&page_id=${page_id}&res_type=${res_type}`
    )
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        console.log("res-----", res);
        // if (res.code === 0) {
        // }
      });
  };

  getDiffResultTotal = () => {
    const urlObj = getUrlParams();
    if (urlObj.task_id) {
      fetch(`/api/getDiffResultTotal?task_id=${urlObj.task_id}`)
        .then((resp) => {
          return resp.json();
        })
        .then((res) => {
          if (res.code === 0) {
            const { firstview, msg = "" } = res.data;
            if (JSON.stringify(firstview) === "{}") {
              message.warn(msg);
            } else {
              const diffResultTotal = JSON.parse(firstview);
              const {
                // total_log = 0,
                diff_count = 0,
                // nilresponse_count = 0,
                // erron500_count = 0,
              } = diffResultTotal;
              if (diff_count !== 0) {
                // 请求diff_count 表格数据
                this.getDiffCount(urlObj.task_id, 2, "diff");
              }
              // if (nilresponse_count !== 0) {
              //   // nilresponse_count 表格数据
              // }
              // if (erron500_count !== 0) {
              //   // nilresponse_count 表格数据
              // }
              this.setState({ diffResultTotal });
            }
          }
        });
    }
  };

  renderBreadcrumb = () => <RightConBreadcrumb text="新建任务" />;

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

  renderHeaderTotalArea = () => {
    const { diffResultTotal } = this.state;
    return (
      <div>
        <RightConSubTitle text="" />
        <div className={styles.inputArea}>
          <div className={styles.sendReportItem}>
            {Object.keys(diffResultTotal).map((key) => {
              return (
                <span key={key} style={{ marginRight: "20px" }}>
                  {key}：
                  <span style={{ color: "red" }}>{diffResultTotal[key]}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  renderForm = () => {
    const { downloadType, selectMethod, hiddenFilter } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <div className={styles.inputArea}>
          {/* 任务名称 */}
          <div className={styles.sendReportItem}>
            <span className={styles.inputText}>任务名称</span>
            <Input
              className={styles.sendReportItemSelect}
              // placeholder="非必填"
              // defaultVal={task_name}
              onValueChange={() => {}}
            />
          </div>
          {/* 接口列表 */}
          <div className={styles.sendReportItem}>
            <span className={styles.inputText}>接口列表</span>
            <Select
              defaultValue="trends_gateway"
              onChange={() => {}}
              className={styles.sendReportItemSelect}
              // value={"1"}
            >
              {renderInterfaceOptions()}
            </Select>
          </div>
          {/* 环境分支 */}
          <div className={styles.sendReportItem}>
            <span className={styles.inputText}>环境分支</span>
            <Input
              placeholder=""
              // value={branch}
              onChange={this.handleBranchChange}
              className={styles.sendReportItemSelect}
            />
          </div>
          <div className={styles.sendReportItem}>
            <span className={styles.inputText}>已有环境</span>
            <Select
              defaultValue="Sfst"
              onChange={() => {}}
              className={styles.sendReportItemSelect}
              // value={"1"}
            >
              {renderProductsOptions()}
            </Select>
          </div>
          <RightConSubTitle text="筛选条件" />
          {!hiddenFilter && (
            <div className={styles.filter}>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>
                  场&nbsp;&nbsp;&nbsp;&nbsp;景
                </span>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ minWidth: "200px" }}
                  placeholder="非必填，多选"
                  // defaultValue={["mainfeed"]}
                  onChange={() => {}}
                  className={styles.sendReportItemSelect}
                >
                  {renderSenceOptions()}
                </Select>
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>产品线</span>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ minWidth: "200px" }}
                  placeholder="非必填，多选"
                  // defaultValue={["Sfst"]}
                  onChange={() => {}}
                  className={styles.sendReportItemSelect}
                >
                  {renderProductsOptions()}
                </Select>
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>营销目标</span>
                <Select
                  mode="multiple"
                  // className={styles.sendReportItemSelect}
                  allowClear
                  style={{ minWidth: "200px" }}
                  placeholder="非必填，多选"
                  // defaultValue="86004001"
                  onChange={() => {}}
                  className={styles.sendReportItemSelect}
                >
                  {renderPromotionObjectiveOptions()}
                </Select>
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>优化目标</span>
                <Select
                  mode="multiple"
                  // className={styles.sendReportItemSelect}
                  allowClear
                  style={{ minWidth: "200px" }}
                  placeholder="非必填，多选"
                  // defaultValue={"88030001"}
                  onChange={() => {}}
                  className={styles.sendReportItemSelect}
                >
                  {renderOptimizationObjectiveOptions()}
                </Select>
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>下载类型</span>
                <Radio.Group
                  options={downloadTypeEadioOptions}
                  onChange={this.handleDownLoadTypeChange}
                  value={downloadType}
                  className={styles.sendReportItemSelect}
                />
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>自定义</span>
                <Input
                  className={styles.sendReportItemSelect}
                  placeholder="非必填"
                  // defaultVal={task_name}
                  onValueChange={() => {}}
                />
              </div>
              <div className={styles.sendReportItem}>
                <span className={styles.inputText}>筛选方式</span>
                <Radio.Group
                  options={selectMethodRadioOptions}
                  onChange={this.handleSelectMethodChange}
                  value={selectMethod}
                  className={styles.sendReportItemSelect}
                />
              </div>
            </div>
          )}
          <div className={styles.sendReportItem}>
            <span className={styles.inputText}>创建者</span>
            <Input
              className={`${styles.sendReportItemSelect} ${styles.creater}`}
              placeholder="输入邮箱前缀，多个以逗号分格"
              // defaultVal={task_name}
              onValueChange={() => {}}
            />
          </div>
          <div className={styles.sendReportItem}>
            <Button type="primary" onClick={() => {}}>
              <span className={styles.new_task}>新建任务</span>
            </Button>
          </div>
        </div>

        {hiddenFilter && (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              left: "50%",
              top: "255px",
            }}
          >
            <DownCircleOutlined
              onClick={() => {
                this.setState({
                  hiddenFilter: false,
                });
              }}
            />
          </div>
        )}
        {!hiddenFilter && (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              left: "50%",
              top: "255px",
            }}
          >
            <UpCircleOutlined
              onClick={() => {
                this.setState({
                  hiddenFilter: true,
                });
              }}
            />
          </div>
        )}
      </div>
    );
  };

  renderDiffFileds = () => {
    return (
      <>
        <div>新增字段：</div>
        <div>修改字段：</div>
        <div>删除字段：</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);
