import React, { useCallback, useEffect, useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

//当前选择的subBlock
let currentSubBlock = null;
//当前平移的距离
let currentTranslatePx = 0;
//当前被选中的sub 原型
let currentOriginSub = null;
//移动范围
let currentLeftLimit = 0;
let currentRightLimit = 0;

const SubBlocks = ({
  duration,
  begin,
  subArray,
  canvasWidth,
  onSubMove,
  onSubMoveError,
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
  const handleMouseDown = useCallback((e, sub) => {
    const subBlock = e.currentTarget.parentElement;
    if (!subBlock) return;
    //赋值
    currentSubBlock = subBlock;
    currentTranslatePx = 0;
    currentOriginSub = sub;
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

  //全局 当鼠标移动时
  const handleDocumentMouseMove = useCallback((e) => {
    if (currentSubBlock === null) return;
    const movable = currentSubBlock.getAttribute("submovable");
    //起始坐标
    const startPageX = currentSubBlock.getAttribute("pagex");
    if (movable === "false" || !startPageX) return;
    //平移的距离
    const translatePx = e.pageX - startPageX;
    currentSubBlock.style.transform = `translate(${translatePx}px)`;
    //滑块移动范围
    const left = currentSubBlock.offsetLeft + translatePx;
    if (
      left > currentLeftLimit + 1 &&
      left < currentRightLimit - currentSubBlock.offsetWidth - 1
    ) {
      //移动距离赋值
      currentTranslatePx = translatePx;
      // 改颜色
      currentSubBlock.children[1].style.backgroundColor = "";
    } else {
      //不在移动范围内
      // 改颜色
      currentSubBlock.children[1].style.backgroundColor = "#f09b50d9";
      //报错
      onSubMoveError && onSubMoveError();
    }
  }, []);

  //全局 鼠标松开时
  const handleDocumentMouseUp = useCallback((e) => {
    if (currentSubBlock === null) return;
    currentSubBlock.children[1].style.backgroundColor = "";
    currentSubBlock.setAttribute("pagex", "");
    currentSubBlock.setAttribute("submovable", "false");
    currentSubBlock.style.transform = ``;
    currentSubBlock.style.zIndex = "";
    //将数据交给接口函数
    onSubMove(currentOriginSub, currentTranslatePx / gapPx / 10);
    //重置
    currentSubBlock = null;
    currentOriginSub = null;
    currentTranslatePx = 0;
    currentLeftLimit = 0;
    currentRightLimit = 0;
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
            className="subBlock"
            // key为开始+结束+内容
            key={sub.start + "" + sub.end + sub.content}
            // 自定义的属性
            submovable="false"
            pagex=""
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
              onMouseDown={(e) => {
                handleMouseDown(e, sub);
              }}
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
  //如果前后字幕数组的内存地址变化 则渲染
  if (preProps.subArray !== nextProps.subArray) {
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
