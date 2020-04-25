import React, { useCallback, useEffect, useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

//当前选择的subBlock
let currentSubBlock = null;
//drag的类型
const dragTypes = ["dragLeft", "dragRight"];
//类型 dragLeft content dragRight
let currentMoveType = null;
//当前平移的距离
let currentTranslatePx = 0;
//当前被选中的sub 原型
let currentOriginSub = null;
//移动范围
let currentLeftLimit = 0;
let currentRightLimit = 0;
//标识是否移动
let currentIsMoved = false;

const SubBlocks = ({
  duration,
  begin,
  subArray,
  canvasWidth,
  onSubClick,
  onSubMove,
  onSubMoveError,
  onSubResize,
  subBlockClass,
}) => {
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
  const handleMouseDown = useCallback((e, sub, type) => {
    const subBlock = e.currentTarget.parentElement;
    if (!subBlock) return;
    //赋值
    currentSubBlock = subBlock;
    currentTranslatePx = 0;
    currentOriginSub = sub;
    currentMoveType = type;
    const movable = subBlock.getAttribute("submovable");
    //将可移动设为true
    subBlock.setAttribute("submovable", "true");
    //记录下点击时的横坐标
    subBlock.setAttribute("pagex", e.pageX);
    //增加z轴为3
    subBlock.style.zIndex = 3;
    //注意这里的width不包括drag的width
    // logger.clog("設為true", e.pageX, subBlock.style.width);

    //左移上限parseFloat 可以把字符串转数字 带px也可
    const preLeft =
      (currentSubBlock.previousElementSibling &&
        currentSubBlock.previousElementSibling.offsetLeft) ||
      0;
    const preWidth =
      (currentSubBlock.previousElementSibling &&
        currentSubBlock.previousElementSibling.offsetWidth) ||
      0;
    const preLimit = preLeft + preWidth;
    //右移上限
    const nextLeft =
      (currentSubBlock.nextElementSibling &&
        currentSubBlock.nextElementSibling.offsetLeft) ||
      Infinity;
    const nextLimit = nextLeft;
    //滑块移动范围
    currentLeftLimit = preLimit;
    currentRightLimit = nextLimit;
  }, []);

  //字幕块移动时
  const handleSubBlockMove = useCallback((e, translatePx) => {
    //只在鼠标点击content时使用
    if (currentSubBlock === null || currentMoveType !== "content") return;
    currentSubBlock.style.transform = `translate(${translatePx}px)`;
  }, []);

  //drag移动时 （handler）
  const handleSubDragMove = useCallback((e, translatePx) => {
    //只在鼠标点击drag时使用
    if (currentSubBlock === null || !dragTypes.includes(currentMoveType))
      return;
    const width = parseFloat(currentSubBlock.getAttribute("subwidth"));
    //右边的drag
    if (currentMoveType === "dragRight") {
      currentSubBlock.style.width = `${width + translatePx}px`;
      //左边的drag
    } else if (currentMoveType === "dragLeft") {
      currentSubBlock.style.width = `${width - translatePx}px`;
      currentSubBlock.style.transform = `translate(${translatePx}px)`;
    }
  }, []);

  //判断移动的类型 dragLeft content dragRight 并返回是否在移动范围内
  const jugeMoveRange = useCallback((translatePx) => {
    if (currentSubBlock === null || currentMoveType === null) return;
    //计算滑块是否出界
    const left = currentSubBlock.offsetLeft + translatePx;
    const right = currentSubBlock.offsetLeft + currentSubBlock.offsetWidth;
    if (currentMoveType === "content") {
      return (
        left > currentLeftLimit + 1 &&
        left + currentSubBlock.offsetWidth + 1 < currentRightLimit
      );
    } else if (currentMoveType === "dragLeft") {
      // left > currentLeftLimit + 1 && (right < currentRightLimit - 1||left + currentSubBlock.offsetWidth + 1 < currentRightLimit)
      return left > currentLeftLimit + 1 && currentSubBlock.offsetWidth > 5;
    } else if (currentMoveType === "dragRight") {
      return right < currentRightLimit - 1 && currentSubBlock.offsetWidth > 5;
    }
  }, []);

  //全局 当鼠标移动时
  const handleDocumentMouseMove = useCallback((e) => {
    if (currentSubBlock === null || currentMoveType === null) return;
    const movable = currentSubBlock.getAttribute("submovable");
    //起始坐标
    const startPageX = currentSubBlock.getAttribute("pagex");
    if (movable === "false" || !startPageX) return;
    //平移的距离
    const translatePx = e.pageX - startPageX;
    //移动滑块
    handleSubBlockMove(e, translatePx);
    //移动drag
    handleSubDragMove(e, translatePx);
    //滑块移动范围判定
    if (jugeMoveRange(translatePx)) {
      //待存移动距离赋值 （currentTranslatePx 在鼠标松开时会转为秒数保存
      currentTranslatePx = translatePx;
      //标识开始移动
      currentIsMoved = true;
      //默认背景
      currentSubBlock.children[1].style.backgroundColor = "";
    } else {
      //不在移动范围内
      // 改颜色 橘色警告
      currentSubBlock.children[1].style.backgroundColor = "#f09b50d9";
      //报错
      onSubMoveError && onSubMoveError();
    }
  }, []);

  //全局 鼠标松开时
  const handleDocumentMouseUp = useCallback((e) => {
    if (currentSubBlock === null || currentMoveType === null) return;
    //属性恢复到默认值
    currentSubBlock.children[1].style.backgroundColor = "";
    currentSubBlock.setAttribute("pagex", "");
    currentSubBlock.setAttribute("submovable", "false");
    currentSubBlock.style.transform = ``;
    currentSubBlock.style.zIndex = "";
    //在有效移動時 将数据交给接口函数
    if (currentIsMoved && currentMoveType === "content") {
      onSubMove && onSubMove(currentOriginSub, currentTranslatePx / gapPx / 10);
    } else if (currentIsMoved && dragTypes.includes(currentMoveType)) {
      onSubResize &&
        onSubResize(
          currentOriginSub,
          currentTranslatePx / gapPx / 10,
          currentMoveType === "dragLeft" ? "start" : "end"
        );
    }
    //重置
    currentSubBlock = null;
    currentOriginSub = null;
    currentTranslatePx = 0;
    currentLeftLimit = 0;
    currentRightLimit = 0;
    currentIsMoved = false;
  });

  useEffect(() => {
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () => {
      // 组件卸载时
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }, [handleDocumentMouseUp, handleDocumentMouseMove]);

  //数组筛选
  const filteredSubArray = filterSubArray();
  //计算grid
  const gapPx = painter.getGapPx(canvasWidth, duration);
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
            className={`subBlock ${subBlockClass ? subBlockClass : ""}`}
            // key为开始+结束+内容
            key={sub.start + "" + sub.end + sub.content}
            // 自定义的属性
            submovable="false"
            pagex=""
            subwidth={`${sub.length * gapPx * 10}`}
            style={{
              left: (sub.start - begin) * gapPx * 10,
              width: sub.length * gapPx * 10,
            }}
          >
            <div
              className="subBlockDrag"
              style={{
                left: `-${1.5 * gapPx}px`,
                width: 1.5 * gapPx,
                borderRadius: `${0.7 * gapPx}px 0 0 ${0.7 * gapPx}px`,
              }}
              onMouseDown={(e) => {
                handleMouseDown(e, sub, "dragLeft");
              }}
            >
              <i className="fa fa-bars fa-rotate-90 subBlockDragIcon"></i>
            </div>
            <div
              className="subBlockContent"
              onMouseDown={(e) => {
                handleMouseDown(e, sub, "content");
              }}
              onClick={(e) => {
                onSubClick && onSubClick(sub);
              }}
            >
              {sub.content.split(/\r?\n/).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div
              className="subBlockDrag"
              style={{
                right: `-${1.5 * gapPx}px`,
                width: 1.5 * gapPx,
                borderRadius: `0 ${0.7 * gapPx}px ${0.7 * gapPx}px 0`,
              }}
              onMouseDown={(e) => {
                handleMouseDown(e, sub, "dragRight");
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
  //如果前后字幕数组的内存地址变化 或者canvas宽度发生变化 则渲染
  if (
    preProps.subArray !== nextProps.subArray ||
    preProps.canvasWidth !== nextProps.canvasWidth
  ) {
    return false;
  }

  //返回false表示渲染 true表示不渲染
  if (nextProps.begin === 0 && init <= 5) {
    //初始状态 最多渲染5次
    init++;
    return false;
  }

  return (
    //开始时间是否变化
    preProps.begin === nextProps.begin
  );
});
