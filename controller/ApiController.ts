import {
  Router,
  inject,
  interfaces,
  httpGet,
  httpPost,
  TYPE,
  controller,
  TAGS,
  provideThrowable,
} from "../ioc";
import { host, port } from "../constant/config";
import * as queryString from "query-string";
const urlPrefix = `${host}:${port}/`;

@provideThrowable(TYPE.Controller, "ApiController")
@controller("/api")
export default class ApiController implements interfaces.Controller {
  private apiService;
  constructor(@inject(TAGS.ApiService) apiService) {
    this.apiService = apiService;
  }
  @httpGet("/getAllTask")
  private async getAllTask(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    const url: string = `${urlPrefix}all_task`;
    let res: object = {};
    // try {
    //   const result: Promise<Object> = await this.apiService.getInfo(url);
    //   res = result;
    // } catch {
    //   res = {
    //     code: 1,
    //     message: "接口返回错误",
    //   };
    // }

    res = {
      code: 0,
      data: [
        {
          project_name: "项目名称0",
          branch: "测试分支0",
          time: "2020/10/29 12:05:49",
          if_successed: true,
          task_id: 1,
        },
        {
          project_name: "项目名称1",
          branch: "测试分支1",
          time: "2020/11/29 12:05:49",
          if_successed: false,
          task_id: 5,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 2,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 3,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 4,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 7,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 9,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 10,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 11,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 13,
        },
        {
          project_name: "项目名称2",
          branch: "测试分支2",
          time: "2020/10/19 12:05:49",
          if_successed: true,
          task_id: 18,
        },
      ],
    };
    ctx.body = res;
  }
  @httpGet("/getDiffResult")
  private async getDiffResult(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    let query = ctx.request.body;
    // get 参数获取方式： ctx.request.query
    console.log("ctx.request.query", ctx.request.query);
    const {
      request: {
        query: { task_id, page_id, page_size },
      },
    } = ctx;
    const url: string = `${urlPrefix}diff_result?task_id=${task_id}&page_id=${page_id}&page_size=${page_size}`;
    let res: object = {};
    // try {
    //   const result: Promise<Object> = await this.apiService.getInfo(url);
    //   res = result;
    // } catch {
    //   res = {
    //     code: 1,
    //     message: "接口返回错误",
    //   };
    // }

    res = {
      code: 0,
      data: {
        task_result: "fail", // success fail no_pramas
        total_num: 50,
        list: [
          {
            project_name: "项目名称001",
            branch: "测试分支0",
            result: {
              in_params: {},
              json_master: {},
              json_test: {},
              diff_result: {
                add: {},
                delete: {},
                modify: {},
              },
            },
            is_filtered: "include", // include  not_include
            black_list: { b: "b" }, // black_list white_list 返回其中一个
            white_list: { w: "w" },
          },
          {
            project_name: "项目名称002",
            branch: "测试分支1",
            result: {
              in_params: {},
              json_master: {},
              json_test: {},
              diff_result: {
                add: {},
                delete: {},
                modify: {},
              },
            },
            is_filtered: "not_include", // include  not_include
            black_list: { b: "b" }, // black_list white_list 返回其中一个
            white_list: { w: "w" },
          },
          {
            project_name: "项目名称003",
            branch: "测试分支2",
            result: {
              in_params: {},
              json_master: {},
              json_test: {},
              diff_result: {
                add: {},
                delete: {},
                modify: {},
              },
            },
            is_filtered: "include", // include  not_include
            black_list: { b: "b" }, // black_list white_list 返回其中一个
            white_list: { w: "w" },
          },
          {
            project_name: "项目名称004",
            branch: "测试分支3",
            result: {
              in_params: {},
              json_master: {},
              json_test: {},
              diff_result: {
                add: {},
                delete: {},
                modify: {},
              },
            },
            is_filtered: "include", // include  not_include
            black_list: { b: "b" }, // black_list white_list 返回其中一个
            white_list: { w: "w" },
          },
        ],
      },
    };
    ctx.body = res;
  }
  @httpPost("/newProject")
  private async newProject(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    let query = ctx.request.body;
    let res: object = {
      code: 0,
    };
    const { projectName: project_name, branch } = query;
    const params: object = {
      project_name,
      branch,
    };
    const url: string = `${urlPrefix}new_project`;
    // const url: string = `http://localhost:3001/api/posttest`; // test code
    const opts: object = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };
    try {
      this.apiService.getInfo(url, opts);
    } catch {
      res = {
        code: 1,
        message: "接口错误",
      };
    }
    ctx.body = res;
  }
}
