import React, { useState, useCallback } from "react";
import WaveCanvas from "./waveCanvas";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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
      console.log("callback ref", wave);
      const { clientHeight, clientWidth } = wave;
      setShwave(wave);
      setContainer({
        height: clientHeight,
        width: clientWidth,
      });
    }
  }, []);

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
        duration={60}
        backgroundColor={"#529393"}
      />
    </div>
  );
};

export default ShWave;
