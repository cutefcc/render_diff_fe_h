import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as R from "ramda";
import autobind from "autobind-decorator";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import SearchInput from "commonComponents/SearchInput";
import * as actions from "store/actions";
import { getUrlParams, get10BitRandomStr } from "utils/index";
import { moduleConfig, senceConfig, productsConfig } from "constants/index";
import { MUIButton } from "test-cutefcc";
import {
  Input,
  Radio,
  DatePicker,
  Space,
  Table,
  Select,
  message,
  Button,
} from "antd";
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import "./index.less";
const radioOptions = [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
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
const initDataItem = {
  module: "uve",
  bugLink: "",
};

@withRouter
@autobind
class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {},
      testResult: "yes", // 测试结果
      testContent: "", // 测试内容
      testProblem: "", // 测试遇到的问题
      taskName: "", // 项目名称
    };
  }

  componentDidMount() {
    this.handleGetUrlParams();
  }

  handleAddBug = (item) => {
    this.bottomDiv.scrollIntoView();
    const { tableData } = this.state;
    tableData.splice(tableData.indexOf(item), 0, {
      key: get10BitRandomStr(10),
      ...initDataItem,
    });
    this.setState({
      tableData: [...tableData],
    });
  };

  handleDeleteBug = (item) => {
    const { tableData } = this.state;
    if (tableData.length === 1) {
      message.destroy();
      message.info("不能删除最后一项");
      return;
    }
    tableData.splice(tableData.indexOf(item), 1);
    this.setState({
      tableData: [...tableData],
    });
  };

  handleGetUrlParams = () => {
    const urlObj = getUrlParams();
    this.setState({
      urlParams: urlObj,
      taskName: R.pathOr("", ["task_name"], urlObj),
    });
  };

  handleRadioChange = (e) => {
    this.setState({
      testResult: e.target.value,
    });
  };

  handleTestContentChange = (v) => {
    this.setState({
      testContent: v.target.value,
    });
  };

  handleTestProblemChange = (v) => {
    console.log(v);
  };

  handleTaskNameChange = (val) => {
    this.setState({
      taskName: val,
    });
  };

  renderBreadcrumb = () => <RightConBreadcrumb text="首页" />;

  renderForm = () => {
    const task_name = R.pathOr("", ["state", "urlParams", "task_name"], this);
    const columns = R.pathOr([], ["state", "columns"], this);
    const tableData = R.pathOr([], ["state", "tableData"], this);
    return (
      <>
        <RightConSubTitle text="" />
        <div className="inputArea">
          <div className="sendReportItem">
            <span className="inputText">项目名称</span>
            <SearchInput
              csName="sendReportItemSelect"
              placeholder="请填写项目名称"
              defaultVal={task_name}
              onValueChange={this.handleTaskNameChange}
            />
          </div>
          <div className="sendReportItem">
            <span className="inputText">环境分支</span>
            <Input
              placeholder=""
              // value={mid}
              // onChange={this.handleMidChange}
              className="sendReportItemSelect"
            />
          </div>
          <div
            ref={(dom) => (this.bottomDiv = dom)}
            style={{ height: "0px", overflow: "hidden" }}
          ></div>
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
              options={radioOptions}
              onChange={this.handleRadioChange}
              value={this.state.testResult}
            />
          </div>
          <div className="sendReportItem" style={{ marginTop: "25px" }}>
            <Button
              type="primary"
              size="middle"
              style={{ borderRadius: "5px", marginLeft: "20px" }}
              onClick={() => {}}
            >
              正向选择
            </Button>
            <Button
              type="primary"
              size="middle"
              style={{ borderRadius: "5px", marginLeft: "80px" }}
              onClick={() => {}}
            >
              反向选择
            </Button>
            <MUIButton type="mbutton_s_fixed_blue450_l1" onClick={this.handleClick}>一级按钮</MUIButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
