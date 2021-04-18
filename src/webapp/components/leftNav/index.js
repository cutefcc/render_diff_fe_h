import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "store/actions";
import * as R from "ramda";
import autobind from "autobind-decorator";
import { Menu, Button } from "antd";
import {
  ContainerOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

import styles from "./index.less";

@withRouter
@autobind
class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleItemClick(key) {
    this.props.changeCheckedNav(key);
  }

  toggleCollapsed() {
    this.props.changeLeftNavStatus(!this.props.leftNavStatus);
  }

  render() {
    const leftNavStatus = R.pathOr("", ["props", "leftNavStatus"], this);
    const checkedNav = R.pathOr("5", ["props", "checkedNav"], this);
    return (
      <>
        <Button
          type="primary"
          onClick={this.toggleCollapsed}
          style={{
            marginBottom: 16,
            position: "absolute",
            left: !leftNavStatus ? "180px" : "80px",
            top: "5px",
          }}
        >
          {React.createElement(
            leftNavStatus ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </Button>
        <Menu
          selectedKeys={[checkedNav]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={leftNavStatus}
          className={styles.menuUl}
        >
          {/* <Menu.Item
            key="4"
            onClick={() => {
              this.props.history.push("/newProject");
              this.handleItemClick("4");
            }}
            icon={<ContainerOutlined />}
          >
            新建项目
          </Menu.Item> */}
          <Menu.Item
            key="2"
            onClick={() => {
              this.props.history.push("/new_task");
              this.handleItemClick("2");
            }}
            icon={<DesktopOutlined />}
          >
            新建任务
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={() => {
              this.props.history.push("/all_task");
              this.handleItemClick("3");
            }}
            icon={<DesktopOutlined />}
          >
            任务列表
          </Menu.Item>

          <Menu.Item
            key="4"
            onClick={() => {
              this.props.history.push("/data_diff");
              this.handleItemClick("4");
            }}
            icon={<ContainerOutlined />}
          >
            数据对比
          </Menu.Item>
        </Menu>
      </>
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
    changeCheckedNav: (key) => {
      dispatch(actions.changeCheckedNav(key));
    },
    // change left nav status
    changeLeftNavStatus: (payload) => {
      dispatch(actions.changeLeftNavStatus(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
