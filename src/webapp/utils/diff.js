const separate = "|";
function isNumber(obj) {
  return "[object Number]" === Object.prototype.toString.call(obj);
}
function isString(obj) {
  return "[object String]" === Object.prototype.toString.call(obj);
}
function isBoolean(obj) {
  return "[object Boolean]" === Object.prototype.toString.call(obj);
}
function isNull(obj) {
  return "[object Null]" === Object.prototype.toString.call(obj);
}
function isUndefined(obj) {
  return "[object Undefined]" === Object.prototype.toString.call(obj);
}
// function isArrayOrObj(obj) {
//   return ["[object Array]", "[object Object]"].includes(
//     Object.prototype.toString.call(obj)
//   );
// }
// function isArray(obj) {
//   return ["[object Array]"].includes(Object.prototype.toString.call(obj));
// }
// function isObj(obj) {
//   return ["[object Object]"].includes(Object.prototype.toString.call(obj));
// }
// json1 为基准，json2 相对于 json1  a：新增的字段  n: 没有改变的字段 m：修改的字段 d: 被删除的字段
function findAM(json1, json2, resKey = `obj${separate}`) {
  let res = {};
  for (let key in json2) {
    // case 1: json2存在 json1不存在-----a
    if (!Object.prototype.hasOwnProperty.call(json1, key)) {
      res[`${resKey}${key}`] = "a";
    }
    // case 2: json2存在 json1也存在（只有两种情况：n: 没有改变的字段 m：被修改）
    else if (Object.prototype.hasOwnProperty.call(json1, key)) {
      const v2 = json2[key];
      const v1 = json1[key];
      const v2IsNormal =
        isNumber(v2) ||
        isString(v2) ||
        isBoolean(v2) ||
        isNull(v2) ||
        isUndefined(v2);
      const v1IsNormal =
        isNumber(v1) ||
        isString(v1) ||
        isBoolean(v1) ||
        isNull(v1) ||
        isUndefined(v1);
      // 都是基本类型（ 数字、字符串、布尔值、null、undefined）
      if (v1IsNormal && v2IsNormal) {
        if (v2 !== v1) {
          res[`${resKey}${key}`] = "m";
        }
      } else if ((v1IsNormal && !v2IsNormal) || (!v1IsNormal && v2IsNormal)) {
        // 一个基本类型，一个不是基本类型
        res[`${resKey}${key}`] = "m";
      } else if (!v1IsNormal && !v2IsNormal) {
        // 都不是基本类型（考虑数组 和 对象）
        // 类型一致
        if (
          Object.prototype.toString.call(v1) ===
          Object.prototype.toString.call(v2)
        ) {
          res = { ...res, ...findAM(v1, v2, `${resKey}${key}${separate}`) };
        } else {
          // 类型不一致
          res[`${resKey}${key}`] = "m";
        }
      }
    }
  }
  return res;
}
function findD(json1, json2, resKey = `obj${separate}`) {
  let res = {};
  // 找delete的
  for (let key in json1) {
    // json1 有 json2无的情况
    const v2 = json2[key];
    const v1 = json1[key];
    const v2IsNormal =
      isNumber(v2) ||
      isString(v2) ||
      isBoolean(v2) ||
      isNull(v2) ||
      isUndefined(v2);
    const v1IsNormal =
      isNumber(v1) ||
      isString(v1) ||
      isBoolean(v1) ||
      isNull(v1) ||
      isUndefined(v1);
    // json1 有，json2 没有
    if (!Object.prototype.hasOwnProperty.call(json2, key)) {
      res[`${resKey}${key}`] = "d";
    } else {
      if (
        !v2IsNormal &&
        !v1IsNormal &&
        Object.prototype.toString.call(v1) ===
          Object.prototype.toString.call(v2)
      ) {
        res = { ...res, ...findD(v1, v2, `${resKey}${key}${separate}`) };
      }
    }
  }
  return res;
}
function diff(json1, json2) {
  return { ...findAM(json1, json2), ...findD(json1, json2) };
}
export { diff };
