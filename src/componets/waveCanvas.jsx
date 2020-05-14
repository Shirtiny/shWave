import React, { useState, useEffect, useCallback } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Parse from "./parse";

const WaveCanvas = ({
  $canvas,
  waveCanvas,
  draw,
  currentTime,
  duration,
  url,
  audioData,
  updateAudioData
}) => {
  useEffect(() => {
    if (waveCanvas === null) return;
    //绘制
    draw();
  }, [waveCanvas,duration, currentTime,audioData]);

  return (
    <React.Fragment>
      <canvas
        ref={$canvas}
        id="shcanvas"
        css={css`
          height: 100%;
          width: 100%;
          z-index: 0;
          pointer-events: auto;
        `}
      ></canvas>
      <Parse url={url} updateAudioData={updateAudioData}/>
    </React.Fragment>
  );
};

export default React.memo(WaveCanvas);
