import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import * as actions from "store/actions";
import TopHeader from "components/header";
import NewTask from "components/Content/NewTask";
import AllTask from "components/Content/AllTask";
import DataDiff from "components/Content/DataDiff";
import TaskDetail from "components/Content/TaskDetail";
import LeftNav from "components/leftNav/index";
import RefreshLeftNavChecked from "utils/refreshLeftNavChecked";

import styles from "./index.less";
import { Layout } from "antd";

function App(props) {
  const { dispatch } = props;
  const ref = useRef();
  useEffect(() => {
    ref.current.handleLeftNavChecked(); // 切换leftNav 选择状态
    dispatch(
      actions.saveLeftNavCheckedMethod(ref.current.handleLeftNavChecked)
    );
  }, []);

  return (
    <BrowserRouter>
      <Layout className={styles.layout}>
        <TopHeader />
        <div className={styles.mainContainer}>
          <LeftNav />
          <Route path="/" exact component={NewTask} />
          <Route path="/new_task" component={NewTask} />
          <Route path="/all_task" component={AllTask} />
          <Route path="/data_diff" component={DataDiff} />
          <Route path="/task_detail" component={TaskDetail} />
        </div>
        <RefreshLeftNavChecked ref={ref} dispatch={dispatch} />
      </Layout>
    </BrowserRouter>
  );
}

export default connect((state, dispatch) => ({
  dispatch,
}))(App);
