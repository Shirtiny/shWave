import React, { useState, useEffect, useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";
import common from "../common/common";

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

  const drawRuler = (waveCanvas, ctx) => {
    if (!waveCanvas && !ctx) return;
    const { width, height } = waveCanvas;
    console.log(waveCanvas);
    const fontSize = 11;
    const fontHeight = 15;
    const fontTop = 30;
    //字体
    ctx.font = `${fontSize * pixelRatio}px Arial`;
    //颜色
    ctx.fillStyle = "#fff";
    //尺子单位长度 （有几格
    const length = duration * 10;
    //每格间距
    const gap = width / length;
    console.log(width, length, gap, pixelRatio);
    //起始时间
    const begin = Math.floor(currentTime / duration) * duration;
    let second = -1;
    for (let index = 0; index < length; index += 1) {
      if (index % 10 === 0) {
        second += 1;
        ctx.fillRect(index * gap, 0, pixelRatio, fontHeight * pixelRatio);
        ctx.fillText(
          common.durationToTime(begin + second).split(".")[0],
          gap * index - fontSize * pixelRatio * 2 + pixelRatio,
          fontTop * pixelRatio
        );
      } else if (index % 5 === 0) {
        ctx.fillRect(
          index * gap,
          0,
          pixelRatio,
          (fontHeight * pixelRatio) / 1.5
        );
      } else {
        ctx.fillRect(index * gap, 0, pixelRatio, (fontHeight * pixelRatio) / 3);
      }
    }
  };

  //callback-refs
  const $canvas = useCallback((canvas) => {
    if (canvas !== null) {
      setWaveCanvas(canvas);
      const ctx = canvas.getContext("2d");
      setCtx(ctx);
      console.log("Callback ref waveCanvas", canvas);
    }
  }, []);

  useEffect(() => {
    if (waveCanvas === null || container === null) return;
    console.log("绘制");
    const { height, width } = container;
    waveCanvas.width = width * pixelRatio;
    waveCanvas.height = height * pixelRatio;
    //绘制背景
    painter.drawBackground(waveCanvas, ctx, backgroundColor);
    //绘制尺子
    drawRuler(waveCanvas, ctx);
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
