import React, { useCallback, useEffect, useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

const SubBlocks = ({ duration, begin, subArray, canvasWidth }) => {
  //用于筛选数组
  const filterSubArray = useCallback(() => {
    const filtered = [...subArray].filter(
      (sub) => sub.start >= begin && sub.start < begin + duration
    );
    return filtered;
  }, [duration, begin, subArray]);

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
            id="subBlock"
            // key为开始+结束+内容
            key={sub.start + "" + sub.end + sub.content}
            style={{
              left: (sub.start - begin) * gapPx * 10,
              width: sub.length * gapPx * 10,
            }}
          >
            {sub.content}
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
