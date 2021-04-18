import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { getUrlParams } from "utils/index";
import { withRouter } from "react-router-dom";
import RightConSubTitle from "commonComponents/RightConSubTitle";
import RightConBreadcrumb from "commonComponents/RightConBreadcrumb";
import ShowJson from "commonComponents/ShowJson";
import * as actions from "store/actions";
import { Table, Button, Input } from "antd";
import { EyeOutlined, InteractionTwoTone } from "@ant-design/icons";

import styles from "./index.less";

export default withRouter(function TaskDetail({ history }) {
  const dispatch = useDispatch();
  const [taskId, setTaskId] = useState(0); // task_id
  const [allInfo, setAllInfo] = useState({}); // 总概信息
  const [firstView, setFirstView] = useState({}); // 总概---firstview
  const [blackWhiteList, setBlackWhiteList] = useState({}); // 总概---blackWhiteList
  const [diffLists, setDiffLists] = useState([]); // 差异列表数据
  const [nilresponseLists, setNilresponseLists] = useState([]); // 空列表数据
  const [errorLists, setErrorLists] = useState([]); // 失败列表
  const [isModalVisible, setIsModalVisible] = useState(false); //
  const [json, setJson] = useState({}); //
  const diffColumns = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "请求体",
      dataIndex: "request_body",
      render: (request_body) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(request_body);
                }}
                title="点击查看"
              >
                <EyeOutlined style={{ cursor: "pointer" }} />
              </div>
            }
          </>
        );
      },
    },
    {
      title: "测试返回",
      dataIndex: "test_response",
      render: (test_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(test_response);
                }}
                title="点击查看"
              >
                <EyeOutlined style={{ cursor: "pointer" }} />
              </div>
            }
          </>
        );
      },
    },
    {
      title: "主环境返回",
      dataIndex: "master_response",
      render: (master_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(master_response);
                }}
                title="点击查看"
              >
                <EyeOutlined style={{ cursor: "pointer" }} />
              </div>
            }
          </>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "self",
      render: (self) => {
        return (
          <>
            <span
              onClick={() => {
                handleSetDiffJson(self);
              }}
              title="数据对比"
            >
              <InteractionTwoTone style={{ cursor: "pointer" }} />
            </span>{" "}
            <span>手工重试</span> <span>添加备注</span> <span>删除</span>
          </>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "branch",
      //   render: () => {
      //     return <><span>数据对比</span> <span>手工重试</span> <span>添加备注</span> <span>删除</span></>;
      //   },
    },
    {
      title: "备注",
      dataIndex: "note",
    },
  ];
  const nilresponseColumns = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "请求体",
      dataIndex: "request_body",
      render: (request_body) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(request_body);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "测试返回",
      dataIndex: "test_response",
      render: (test_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(test_response);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "主环境返回",
      dataIndex: "master_response",
      render: (master_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(master_response);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "branch",
      render: () => {
        return (
          <>
            <span>手工重试</span> <span>添加备注</span> <span>删除</span>
          </>
        );
      },
    },
  ];
  const errorColumns = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "请求体",
      dataIndex: "request_body",
      render: (request_body) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(request_body);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "测试返回",
      dataIndex: "test_response",
      render: (test_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(test_response);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "主环境返回",
      dataIndex: "master_response",
      render: (master_response) => {
        return (
          <>
            {
              <div
                onClick={() => {
                  handleViewJson(master_response);
                }}
              >
                点击查看
              </div>
            }
          </>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "branch",
      render: () => {
        return (
          <>
            <span>手工重试</span> <span>添加备注</span> <span>删除</span>
          </>
        );
      },
    },
  ];
  const handleSetDiffJson = (self) => {
    dispatch(actions.setJson1(JSON.parse(self.test_response)));
    dispatch(actions.setJson2(JSON.parse(self.master_response)));
    history.push("/data_diff");
    dispatch(actions.changeCheckedNav("4"));
  };
  // 查看json
  const handleViewJson = (json) => {
    setIsModalVisible(true);
    setJson(JSON.parse(json));
  };

  // 获取总概信息
  const handleGetDiffResult = (task_id) => {
    fetch(`/api/diff_result?task_id=${task_id}`)
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.code === 0) {
          setAllInfo(res.data || {});
          const { firstview, black_white_list } = res.data;
          setFirstView(JSON.parse(firstview));
          setBlackWhiteList(JSON.parse(black_white_list));
        }
      });
  };
  // 按照类型获取返回结果
  const handleGetDiffTypeResult = (page_id = 1, res_type, page_size = 5) => {
    fetch(
      `/api/difftyperesult?page_id=${page_id}&res_type=${res_type}&page_size=${page_size}`
    )
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.code === 0) {
          const {
            data: { data },
          } = res;
          const len = data.length;
          for (let i = 0; i < len; i++) {
            data[i].sort = i + 1;
            data[i].self = data[i];
          }
          if (res_type === "nilresponse") {
            setNilresponseLists(data);
          }
          if (res_type === "diff") {
            setDiffLists(data);
          }
          if (res_type === "errno500") {
            setErrorLists(data);
          }
        }
      });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleUrlParams = () => {
    const urlObj = getUrlParams();
    if (urlObj.task_id) {
      handleGetDiffResult(urlObj.task_id);
      handleGetDiffTypeResult(1, "nilresponse", 5);
      handleGetDiffTypeResult(1, "diff", 5);
      handleGetDiffTypeResult(1, "errno500", 5);
      setTaskId(urlObj.task_id);
    }
  };
  useEffect(() => {
    handleUrlParams();
  }, []);

  const renderBreadcrumb = () => <RightConBreadcrumb text="任务总概" />;

  return (
    <div className={`${styles.rightCon}`}>
      {renderBreadcrumb()}
      <RightConSubTitle text="" />
      <div className={styles.topContainer}>
        <div className={styles.line}>
          <span>筛选条件：xxxx</span>
          <span>场景：xxxx</span>
          <span>下载方式：xxxx</span>
          <span>筛选方式：{blackWhiteList.is_filtered}</span>
        </div>
        <div className={styles.line}>
          <span>对比流量数量：{firstView.total_log}条</span>
        </div>
        <div className={styles.line}>
          <span>失败详情：</span>
          <span>失败总数：10条</span>
          <span>有差异：{firstView.diff_count}条</span>
          <span>空结果：{firstView.nilresponse_count}条</span>
          <span>服务错误：{firstView.erron500_count}条</span>
        </div>
        <div className={styles.line}>
          <span>测试环境：{allInfo.test_url}</span>
        </div>
        <div className={styles.line}>
          <span>主环境：{allInfo.master_url}</span>
        </div>
        <div className={styles.line}>
          <span>环境分支：{allInfo.test_branch}</span>
        </div>
      </div>
      <RightConSubTitle text="差异列表" />
      <div className={styles.tableContainer}>
        <Table
          pagination={false}
          columns={diffColumns}
          dataSource={diffLists}
          size="small"
        />
      </div>
      <RightConSubTitle text="空列表" />
      <div className={styles.tableContainer}>
        <Table
          pagination={false}
          columns={nilresponseColumns}
          dataSource={nilresponseLists}
          size="small"
        />
      </div>
      <RightConSubTitle text="失败列表" />
      <div className={styles.tableContainer}>
        <Table
          pagination={false}
          columns={errorColumns}
          dataSource={errorLists}
          size="small"
        />
      </div>
      {isModalVisible && (
        <ShowJson
          json={json}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
});
