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
