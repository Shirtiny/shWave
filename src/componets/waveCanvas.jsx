import React, { useState, useEffect, useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";
import logger from "../common/logger";

const WaveCanvas = (props) => {
  const {
    container,
    pixelRatio,
    duration,
    backgroundColor,
    currentTime,
  } = props;

  const [waveCanvas, setWaveCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  const draw = useCallback((waveCanvas, ctx, backgroundColor) => {
    //绘制背景
    painter.drawBackground(waveCanvas, ctx, backgroundColor);
    //绘制尺子
    painter.drawRuler(waveCanvas, ctx, pixelRatio, duration, currentTime);
  }, []);

  //更新canvas宽高
  const updateCanvas = useCallback(() => {
    if (!container || !waveCanvas) return;
    logger.clog("更新宽高");
    const { height, width } = container;
    waveCanvas.width = width * pixelRatio;
    waveCanvas.height = height * pixelRatio;
  }, [container, waveCanvas]);

  //callback-refs 初始化时 获取canvas对象
  const $canvas = useCallback((canvas) => {
    if (canvas !== null) {
      setWaveCanvas(canvas);
      const ctx = canvas.getContext("2d");
      setCtx(ctx);
      logger.clog(
        "Callback ref waveCanvas",
        canvas,
        canvas.getBoundingClientRect()
      );
      //设置窗口监听
    }
  }, []);

  useEffect(() => {
    if (waveCanvas === null || container === null) return;
    //更新宽高
    updateCanvas();
    logger.clog("绘制");
    //绘制
    draw(waveCanvas, ctx, backgroundColor);
  }, [container, waveCanvas]);

  return (
    <canvas
      ref={$canvas}
      css={css`
        height: 100%;
        width: 100%;
      `}
    ></canvas>
  );
};

export default WaveCanvas;
