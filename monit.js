const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
var shell = require("shelljs");
const monit = process.argv[2] === "monit"; // 是否监控md文件的变化
const debounce = (fn, tm) => {
  let timer = null;
  return (...argu) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...argu);
    }, tm);
  };
};
const debounseHandleBuild = debounce(handleBuild, 1000);
monit &&
  chokidar
    .watch(path.resolve(__dirname, "./src/**/*"))
    .on("all", (event, path) => {
      event === "change" && console.log(`${path} has changed`);
      event === "change" && debounseHandleBuild();
    });

debounseHandleBuild();

function handleBuild() {
  shell.exec("npm run client:prod");
}
