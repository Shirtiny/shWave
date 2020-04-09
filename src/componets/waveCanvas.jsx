import React, { useState, useEffect, useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";

const WaveCanvas = (props) => {
  const { container, pixelRatio, duration, backgroundColor } = props;

  const [waveCanvas, setWaveCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  const drawRuler = () => {
    if (!waveCanvas && !ctx) return;
    const { width, height } = waveCanvas;
    const fontSize = 11;
    const fontHeight = 15;
    const fontTop = 30;
    //字体
    ctx.font = `${fontSize * pixelRatio}px Arial`;
    //颜色
    ctx.fillStyle = "#fff";
  };

  //callback-refs
  const $canvas = useCallback((canvas) => {
    if (canvas !== null) {
      setWaveCanvas(canvas);
      const ctx = canvas.getContext("2d");
      setCtx(ctx);
      //绘制背景
      painter.drawBackground(canvas, ctx, backgroundColor);
      console.log("Callback ref waveCanvas", canvas);
    }
  }, []);

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
