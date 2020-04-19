import React, { useCallback, useEffect, useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

const SubBlocks = ({ duration, begin, subArray, canvasWidth }) => {
  //用于筛选数组
  const filterSubArray = useCallback(() => {
    const filtered = [...subArray].filter(
      (sub) =>
        (sub.start >= begin && sub.start < begin + duration) ||
        (sub.end > begin && sub.end <= begin + duration)
    );
    return filtered;
  }, [duration, begin, subArray]);

  //当鼠标点下时 subContent
  const handleMouseDown = useCallback((e) => {
    const subBlock = e.currentTarget.parentElement;
    const movable = subBlock.getAttribute("submovable");
    console.log(movable);
    //将可移动设为true
    subBlock.setAttribute("submovable", "true");
    //注意这里的width不包括drag的width
    console.log("設為true", subBlock.style.width);
  });

  //数组筛选
  const filteredSubArray = filterSubArray();
  //计算grid
  const gapPx = painter.getGapPx(canvasWidth, duration);
  console.log(filteredSubArray, canvasWidth, begin, gapPx);

  return (
    <div
      id="subBlocksContainer"
      css={css`
        position: absolute;
        z-index: 1;
        pointer-events: none;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
      `}
    >
      <div
        id="subBlocksInner"
        css={css`
          position: relative;
          pointer-events: none;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
        `}
      >
        {filteredSubArray.map((sub) => (
          <div
            className="subBlock"
            // key为开始+结束+内容
            key={sub.start + "" + sub.end + sub.content}
            // 自定义的属性
            submovable="false"
            style={{
              left: (sub.start - begin) * gapPx * 10,
              width: sub.length * gapPx * 10,
            }}
          >
            <div
              className="subBlockDrag"
              // 自定义的属性
              subtype="dragLeft"
              style={{
                left: `-${1.5 * gapPx}px`,
                width: 1.5 * gapPx,
                borderRadius: `${0.7 * gapPx}px 0 0 ${0.7 * gapPx}px`,
              }}
            >
              <i className="fa fa-bars fa-rotate-90 subBlockDragIcon"></i>
            </div>
            <div
              className="subBlockContent"
              // 自定义的属性
              subtype="content"
              onMouseDown={handleMouseDown}
            >
              <p>{sub.content}</p>
            </div>
            <div
              className="subBlockDrag"
              // 自定义的属性
              subtype="dragRight"
              style={{
                right: `-${1.5 * gapPx}px`,
                width: 1.5 * gapPx,
                borderRadius: `0 ${0.7 * gapPx}px ${0.7 * gapPx}px 0`,
              }}
            >
              <i className="fa fa-bars fa-rotate-90 subBlockDragIcon"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

let init = -1;

export default React.memo(SubBlocks, (preProps, nextProps) => {
  //返回false表示渲染 true表示不渲染
  if (nextProps.begin === 0 && init <= 5) {
    //初始状态 最多渲染5次
    init++;
    return false;
  }
  return preProps.begin === nextProps.begin;
  //subArray待处理
});
