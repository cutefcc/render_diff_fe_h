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
import { senceConfig, productsConfig } from "constants/index";
import { getUrlParams } from "utils/index";
import * as actions from "store/actions";
import { Radio, Select, Input, Button, Modal } from "antd";
import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";
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
      modalWidth: 1000,
      modalHeight: 1000,
      hiddenFilter: false,
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
    this.getAllTaskInfo();
    this.handleHasTaskId();
    this.setModalWidthHeight();
  }

  setModalWidthHeight = () => {
    const w = R.pathOr(1000, ["document", "body", "clientWidth"], window);
    const h = R.pathOr(1000, ["document", "body", "clientHeight"], window);
    this.setState({
      modalWidth: w,
      modalHeight: h,
    });
  };

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
      text={this.state.hasTaskId ? "对比测试 / 详情" : "对比测试"}
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
    const { downloadType, selectMethod, hiddenFilter } = this.state;
    return (
      <div style={{ position: "relative" }}>
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
        {!hiddenFilter && (
          <div className="inputArea">
            <div className="sendReportItem">
              <span className="inputText">场&nbsp;&nbsp;&nbsp;&nbsp;景</span>
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: "200px" }}
                // placeholder="Please select"
                defaultValue={["mainfeed"]}
                onChange={() => {}}
              >
                {renderSenceOptions()}
              </Select>
            </div>
            <div className="sendReportItem">
              <span className="inputText">产品线</span>
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: "200px" }}
                // placeholder="Please select"
                defaultValue={["Sfst"]}
                onChange={() => {}}
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
              <span className="inputText">自定义</span>
              <Input
                className="sendReportItemSelect"
                placeholder="检索条件"
                // defaultVal={task_name}
                onValueChange={() => {}}
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
              <Button
                type="primary"
                onClick={() => {
                  this.handleGetDiffResult();
                  this.setState({
                    hiddenFilter: true,
                  });
                }}
              >
                开始对比
              </Button>
            </div>
          </div>
        )}
        {hiddenFilter && (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              left: "50%",
              top: "140px",
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
              top: "140px",
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
    const { hasTaskId, diffResultList, modalWidth, modalHeight } = this.state;
    return (
      <div className="rightCon sendReport">
        {this.renderBreadcrumb()}
        {!hasTaskId && this.renderForm()}
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
        <Modal
          title="对比结果"
          width={modalWidth}
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ height: `${modalHeight}px`, position: "fixed", top: 0 }}
        >
          <JsonDiffJsx
            modalWidth={modalWidth}
            modalHeight={modalHeight}
            visible={this.state.visible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            json1={this.state.json1}
            json2={this.state.json2}
            diffResStyle={this.state.diffResStyle}
          />
          {this.renderDiffFileds()}
        </Modal>
        {diffResultList.length > 0 && (
          <DiffResultList
            dataSource={diffResultList}
            scanDiffRes={(all) => {
              console.log("all", all);
              this.setState({
                visible: true,
                json_master: all.result.json_master,
                json_test: all.result.json_test,
              });
            }}
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
