import React, { useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

const SubBlocks = ({ duration, currentTime, subArray }) => {
  //筛选数组
  const filterSubArray = useCallback(() => {
    const begin = painter.getBegin(currentTime, duration);
    const filtered = subArray.filter(
      (sub) => sub.start >= begin && sub.start < begin + duration
    );
    return filtered;
  }, [duration, currentTime, subArray]);

  //筛选数组
  const filteredSubArray = filterSubArray();
  return (
    <div
      id="subBlocksContainer"
      css={css`
        position: absolute;
        z-index: 1;
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
            css={css`
              //   position: absolute;
              //   left: 0;
              //   top: 0;
              margin-left: 50px;
              width: 400px;
              background-color: #fff;
            `}
          >
            {sub.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubBlocks;
