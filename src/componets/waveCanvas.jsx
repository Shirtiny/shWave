import React, { useState, useEffect } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const WaveCanvas = (props) => {
  const { shwave } = props;
  const [waveCanvas, setWaveCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  //绘制背景
  const drawBack = () => {
    if (!waveCanvas && !ctx) return;
    const { width, height } = waveCanvas;
    //清空一个矩形
    ctx.clearRect(0, 0, width, height);
    //设置填充绘画的颜色
    ctx.fillStyle = "#529393";
    //填充出一个矩形
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    const canvas = document.querySelector("#waveCanvas");
    setWaveCanvas(canvas);
    setCtx(canvas.getContext("2d"));
    drawBack();
    console.log("useEffect", waveCanvas);
  });

  console.log(shwave);
  return (
    <canvas
      id="waveCanvas"
      css={css`
        height: 100%;
        width: 100%;
      `}
    ></canvas>
  );
};

export default WaveCanvas;
