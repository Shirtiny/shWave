import React, { useState, useEffect, useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import painter from "../common/painter";
import logger from "../common/logger";
import common from "../common/common";

const WaveCanvas = ({
  $canvas,
  waveCanvas,
  updateCanvas,
  draw,
  currentTime,
}) => {

  useEffect(() => {
    logger.clog("useEffect waveCanvas", waveCanvas);
    if (waveCanvas === null) return;
    //绘制
    draw();
  }, [waveCanvas, currentTime]);

  return (
    <canvas
      ref={$canvas}
      id="shcanvas"
      css={css`
        height: 100%;
        width: 100%;
      `}
    ></canvas>
  );
};

export default WaveCanvas;
