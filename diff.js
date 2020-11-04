let json1 = {
  a: {
    b: 1,
  },
  b: {
    c: 2,
  },
  c: {
    d: 3,
  },
};
let json2 = {
  a: {
    b: 1,
    c: 2,
  },
  b: {
    c: 3,
  },
  c: {
    e: 4,
  },
  d: {
    e: 34,
  },
};
function isArrayOrObj(obj) {
  return ["[object Array]", "[object Object]"].includes(
    Object.prototype.toString.call(obj)
  );
}
function isArray(obj) {
  return ["[object Array]"].includes(Object.prototype.toString.call(obj));
}
function isObj(obj) {
  return ["[object Object]"].includes(Object.prototype.toString.call(obj));
}
// json1 为基准， a：add  n: 无改变 m：修改
function diff(json1, json2, resKey = "obj-") {
  let res = {};
  // 以 json1 为基准
  for (let key in json2) {
    // json2 有 json1无的情况
    if (!json1.hasOwnProperty(key)) {
      res[`${resKey}${key}`] = "a";
    }
    // json2 有 json1有的情况
    if (json1.hasOwnProperty(key)) {
      // 都是基本类型- 数字、字符串、布尔值、null、undefined、NaN（先不考虑）
      if (!isArrayOrObj(json2[key]) && !isArrayOrObj(json1[key])) {
        // 相等吗
        if (json2[key] === json1[key]) {
          res[`${resKey}${key}`] = "n";
        } else {
          res[`${resKey}${key}`] = "m";
        }
      } else {
        // 都是引用类型 且 类型不一致
        if (
          Object.prototype.toString.call(json2[key]) !==
          Object.prototype.toString.call(json1[key])
        ) {
          res[`${resKey}${key}`] = "m";
        }
        // 都是引用类型 且 类型一致
        if (
          Object.prototype.toString.call(json2[key]) ===
          Object.prototype.toString.call(json1[key])
        ) {
          res = { ...res, ...diff(json1[key], json2[key], `${resKey}${key}-`) };
        }
      }
    }
  }
  // 找delete的
  for (let key in json1) {
    // json1 有 json2无的情况
    if (!json2.hasOwnProperty(key)) {
      res[`${resKey}${key}`] = "d";
    }
  }
  return res;
}
console.log(diff(json1, json2));
