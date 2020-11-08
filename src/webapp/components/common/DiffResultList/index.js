import React from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";

function DiffResultList(props) {
  const { dataSource, scanDiffRes = () => {} } = props;
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
                scanDiffRes(all);
              }}
            >
              对比结果
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      size="small"
    />
  );
}

export default connect((state, dispatch) => ({
  dispatch,
}))(DiffResultList);
