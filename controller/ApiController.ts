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
import fetch from "cross-fetch";
const FormData = require("form-data");
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
    const {
      request: {
        query: { page_id, page_size },
      },
    } = ctx;
    const url: string = `${urlPrefix}alltasks?page_id=${page_id}&page_size=${page_size}`;
    let res: object = {};
    try {
      const result: Promise<Object> = await this.apiService.getInfo(url);
      res = {
        code: 0,
        data: result,
      };
    } catch {
      res = {
        code: 1,
        msg: "接口返回错误",
      };
    }
    ctx.body = res;
  }
  @httpGet("/getDiffResultTotal")
  private async getDiffResultTotal(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    let res: object = {
      code: 0,
      data: "请求失败",
    };
    const {
      request: {
        query: { task_id },
      },
    } = ctx;
    const url: string = `${urlPrefix}diffresult?task_id=${task_id}`;
    try {
      const result: Promise<Object> = await this.apiService.getInfo(url);
      res = {
        code: 0,
        data: result,
      };
    } catch {
      res = {
        code: 1,
        message: "接口返回错误",
      };
    }
    ctx.body = res;
  }
  @httpGet("/getDiffTypeResult")
  private async getDiffTypeResult(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    let res: object = {
      code: 0,
      data: "请求失败",
    };
    const {
      request: {
        query: { task_id, page_id, res_type },
      },
    } = ctx;
    const url: string = `${urlPrefix}difftyperesult?task_id=${task_id}&page_id=${page_id}&res_type=${res_type}`;
    try {
      const result: Promise<Object> = await this.apiService.getInfo(url);
      res = {
        code: 0,
        data: result,
      };
    } catch {
      res = {
        code: 1,
        message: "接口返回错误",
      };
    }
    ctx.body = res;
  }
  @httpGet("/diff_result")
  private async diff_result(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    const {
      request: {
        query: { task_id },
      },
    } = ctx;
    const url: string = `http://10.30.6.58:5001/diffresult?task_id=216`;
    let res: object = {};
    try {
      const result: Promise<Object> = await this.apiService.getInfo(url);
      res = {
        code: 0,
        data: result,
      };
    } catch (err) {
      res = {
        code: 1,
        message: "接口返回错误",
      };
    }
    ctx.body = res;
  }
  @httpGet("/difftyperesult")
  private async difftyperesult(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    const {
      request: {
        query: { page_id, res_type, page_size },
      },
    } = ctx;
    const url: string = `http://10.30.6.58:5001/difftyperesult?task_id=216&page_id=${page_id}&res_type=${res_type}&page_size=${page_size}`;
    let res: object = {};
    try {
      const result: Promise<Object> = await this.apiService.getInfo(url);
      res = {
        code: 0,
        data: result,
      };
    } catch (err) {
      res = {
        code: 1,
        message: "接口返回错误",
      };
    }
    ctx.body = res;
  }
  // @httpPost("/newProject")
  // private async newProject(
  //   ctx: Router.IRouterContext,
  //   next: () => Promise<any>
  // ): Promise<any> {
  //   let query = ctx.request.body;
  //   let res: object = {
  //     code: 0,
  //     data: "请求失败",
  //   };
  //   const { projectName: project_name, branch } = query;
  //   const url: string = `${urlPrefix}newproject`;
  //   let form = new FormData();
  //   form.append("project_name", project_name);
  //   form.append("branch", branch);

  //   await fetch(url, { method: "POST", body: form })
  //     .then((res) => res.text())
  //     .then((body) => {
  //       if (body === "succeed") {
  //         ctx.body = {
  //           code: 0,
  //           data: body,
  //         };
  //       } else {
  //         ctx.body = {
  //           code: 1,
  //           data: String(body),
  //         };
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       ctx.body = res;
  //     });
  // }
  @httpPost("/new_task")
  private async new_task(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    let query = ctx.request.body;
    let res: object = {
      code: 0,
      data: "请求失败",
    };
    // const { projectName: project_name, branch } = query;
    const url: string = `${urlPrefix}new_task?project=addenvs_info2`;
    let form = new FormData();
    form.append("black_white_list", {
      service: ["groupfeed", "main_feed"],
      product: ["wax", "sfst"],
      is_download: 0,
      is_filter: 0,
    });

    await fetch(url, {
      method: "GET",
      body: JSON.stringify({
        service: ["groupfeed", "main_feed"],
        product: ["wax", "sfst"],
        is_download: 0,
        is_filter: 0,
      }),
    })
      .then((res) => res.text())
      .then((body) => {
        console.log("dddddddddd", body);
      })
      .catch((err) => {
        console.log("err", err);
        ctx.body = res;
      });
  }
}
