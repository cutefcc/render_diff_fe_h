import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import * as R from "ramda";
import fetch from "cross-fetch";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import { senceConfig, productsConfig } from "constants/index";
// import SearchInput from "commonComponents/SearchInput";
import * as actions from "store/actions";
import { Radio, Select, Input, Button } from "antd";
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
// const columns = [
//   {
//     title: "序号",
//     dataIndex: "sort",
//   },
//   {
//     title: "项目名称",
//     dataIndex: "project_name",
//   },
//   {
//     title: "创建日期",
//     dataIndex: "time",
//   },
//   {
//     title: "分支",
//     dataIndex: "branch",
//   },
//   {
//     title: "diff结果",
//     dataIndex: "result_info",
//     render: (data) => {
//       console.log("data===", data);
//       return (
//         <>
//           {data.map((item, index) => {
//             return (
//               <Button key={index} type="primary" onClick={() => {}}>
//                 {index}
//               </Button>
//             );
//           })}
//         </>
//       );
//     },
//   },
// ];

@withRouter
@autobind
class HandleDiff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLists: [],
      downloadType: "yes",
      selectMethod: "yes",
    };
  }

  componentDidMount() {
    this.getAllTaskInfo();
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(HandleDiff);
