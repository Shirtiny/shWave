import React, { useState, useCallback, useEffect } from "react";
import WaveCanvas from "./waveCanvas";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import logger from "../common/logger"

const ShWave = ({ duration = 0 }) => {
  const pixelRatio = window.devicePixelRatio;

  const [container, setContainer] = useState({
    height: "0",
    width: "0",
  });

  const [shwave, setShwave] = useState(null);
  //callback-refs
  const $shwave = useCallback((wave) => {
    if (wave !== null) {
      logger.clog("callback ref", wave);
      setShwave(wave);
      updateContainer();
    }
  }, []);

  const updateContainer = useCallback(() => {
    const shwave = document.querySelector(".shwave");
    if (shwave === null) return;
    logger.clog("更新container");
    const { clientHeight, clientWidth } = shwave;
    setContainer({
      height: clientHeight,
      width: clientWidth,
    });
  }, [shwave]);

  return (
    <div
      ref={$shwave}
      className="shwave"
      css={css`
        position: relative;
        display: flex;
        height: 200px;
        // background-color: #529393;
        background-color: #fff;
      `}
    >
      <WaveCanvas
        container={container}
        pixelRatio={pixelRatio}
        duration={15}
        backgroundColor={"#529393"}
        currentTime={0}
      />
    </div>
  );
};

export default ShWave;
