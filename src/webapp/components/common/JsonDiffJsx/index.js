import React from "react";
import { connect } from "react-redux";
import { diff } from "utils/diff";

function JsonDiffJsx(props) {
  const { modalHeight, json1 = {}, json2 = {}, diffResStyle = {} } = props;
  const isObject = (json) =>
    "[object Object]" === Object.prototype.toString.call(json);
  const isArray = (json) =>
    "[object Array]" === Object.prototype.toString.call(json);
  const renderJsxResult = () => {
    const diffRes = diff(json1, json2);
    return (
      <div
        style={{
          width: "100%",
          height: `${modalHeight - 174}px`,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "49%",
            // overflowX: "auto",
            background: "#fff",
            float: "left",
          }}
        >
          {jsonToJSX(json1, diffRes, true)}
        </div>
        <div
          style={{
            width: "1px",
            height: `${modalHeight}px`,
            background: "#f0f0f0",
            float: "left",
            position: "fixed",
            top: "54px",
            left: "50%",
          }}
        ></div>
        <div
          style={{
            width: "49%",
            // overflowX: "auto",
            background: "#fff",
            float: "right",
          }}
        >
          {jsonToJSX(json2, diffRes, false)}
        </div>
      </div>
    );
  };
  const jsonToJSX = (
    json,
    diffRes,
    isBasic = true,
    showBraces = true,
    objInArr = false,
    level = 1,
    first = true,
    diffKeyPrefix
  ) => {
    const prefix = first ? "obj|" : diffKeyPrefix;
    const separate = "|";
    const isObj = isObject(json);
    const isArr = isArray(json);
    if (!isObj && !isArr) return "";
    if (isObj) {
      return (
        <div>
          {showBraces && <div>{`{`}</div>}
          {Object.keys(json).map((item, index) => {
            const isObj = isObject(json[item]);
            const isArr = isArray(json[item]);
            const isString =
              "[object String]" === Object.prototype.toString.call(json[item]);
            const isNumber =
              "[object Number]" === Object.prototype.toString.call(json[item]);
            let extraItemStyle = {};
            if (isBasic) {
              if (
                Object.prototype.hasOwnProperty.call(
                  diffRes,
                  `${prefix}${item}`
                ) &&
                ["d", "m"].includes(diffRes[`${prefix}${item}`])
              ) {
                extraItemStyle = diffResStyle[diffRes[`${prefix}${item}`]];
              }
            } else {
              if (
                Object.prototype.hasOwnProperty.call(
                  diffRes,
                  `${prefix}${item}`
                ) &&
                ["a", "m"].includes(diffRes[`${prefix}${item}`])
              ) {
                extraItemStyle = diffResStyle[diffRes[`${prefix}${item}`]];
              }
            }

            if (!isObj && !isArr) {
              return (
                <div
                  key={`${item}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                  }}
                >
                  <span style={{ ...extraItemStyle }}>{`"${item}": `}</span>
                  {isString ? (
                    <span style={{ ...extraItemStyle }}>
                      {'"' + json[item] + '"'}
                    </span>
                  ) : isNumber ? (
                    <span style={{ ...extraItemStyle }}>{json[item]}</span>
                  ) : (
                    json[item]
                  )}
                  {","}
                </div>
              );
            }
            if (isObj) {
              return (
                <div
                  key={`${item}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                    ...extraItemStyle,
                  }}
                >
                  <span>
                    {`"${item}": {`}
                    <br />
                  </span>
                  {jsonToJSX(
                    json[item],
                    diffRes,
                    isBasic,
                    false,
                    false,
                    level + 1,
                    false,
                    `${prefix}${item}${separate}`
                  )}
                  <span>
                    {"},"}
                    <br />
                  </span>
                </div>
              );
            }
            if (isArr) {
              return (
                <div
                  key={`${item}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                    ...extraItemStyle,
                  }}
                >
                  <span>
                    {`"${item}": [`}
                    <br />
                  </span>
                  {jsonToJSX(
                    json[item],
                    diffRes,
                    isBasic,
                    false,
                    false,
                    level + 1,
                    false,
                    `${prefix}${item}${separate}`
                  )}
                  <span>
                    {"],"}
                    <br />
                  </span>
                </div>
              );
            }
          })}
          {showBraces && <div>{`}${objInArr ? "," : ""}`}</div>}
        </div>
      );
    }
    if (isArr) {
      return (
        <div>
          {showBraces && <div>{`[`}</div>}
          {json.map((item, index) => {
            const isObj = isObject(item);
            const isArr = isArray(item);
            let extraItemStyle = {};
            if (isBasic) {
              if (
                Object.prototype.hasOwnProperty.call(
                  diffRes,
                  `${prefix}${index}`
                ) &&
                ["d", "m"].includes(diffRes[`${prefix}${index}`])
              ) {
                extraItemStyle = diffResStyle[diffRes[`${prefix}${index}`]];
              }
            } else {
              if (
                Object.prototype.hasOwnProperty.call(
                  diffRes,
                  `${prefix}${index}`
                ) &&
                ["a", "m"].includes(diffRes[`${prefix}${index}`])
              ) {
                extraItemStyle = diffResStyle[diffRes[`${prefix}${index}`]];
              }
            }
            if (!isObj && !isArr) {
              const isString =
                "[object String]" === Object.prototype.toString.call(item);
              const isNumber =
                "[object Number]" === Object.prototype.toString.call(item);
              return (
                <div
                  key={`${item}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                    ...extraItemStyle,
                  }}
                >
                  {isString ? (
                    <span>{'"' + item + '"'}</span>
                  ) : isNumber ? (
                    <span>{item}</span>
                  ) : (
                    item
                  )}
                  {","}
                </div>
              );
            }
            if (isObj) {
              return (
                <div
                  key={`${JSON.stringify(item)}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                    ...extraItemStyle,
                  }}
                >
                  {jsonToJSX(
                    item,
                    diffRes,
                    isBasic,
                    true,
                    true,
                    level + 1,
                    false,
                    `${prefix}${index}${separate}`
                  )}
                </div>
              );
            }
            if (isArr) {
              return (
                <div
                  key={`${item}${index}`}
                  style={{
                    paddingLeft: `${level * 10}px`,
                    ...extraItemStyle,
                  }}
                >
                  <div>{`"${item}": [`}</div>
                  {jsonToJSX(
                    item,
                    diffRes,
                    isBasic,
                    false,
                    false,
                    level + 1,
                    false,
                    `${prefix}${index}${separate}`
                  )}
                  <div>{"],"}</div>
                </div>
              );
            }
          })}
          {showBraces && <div>{`]`}</div>}
        </div>
      );
    }
  };
  return renderJsxResult();
}

export default connect((state, dispatch) => ({
  dispatch,
}))(JsonDiffJsx);
