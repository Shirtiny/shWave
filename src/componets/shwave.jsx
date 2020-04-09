import React, { useState, useEffect } from "react";
import WaveCanvas from "./waveCanvas";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const pixelRatio = window.devicePixelRatio;

const ShWave = () => {
  const [shwave, setShwave] = useState(null);

  useEffect(() => {
    const wave = document.querySelector(".shwave");
    // shwave.innerHTML = "";
    // const { clientHeight, clientWidth } = shwave;
    // const canvas = document.createElement("canvas");
    // canvas.height = clientHeight * pixelRatio;
    // canvas.width = clientWidth * pixelRatio;
    // canvas.style.height = "100%";
    // canvas.style.width = "100%";
    // shwave.appendChild(canvas);
    setShwave(wave);
    console.log("useEffect", shwave);
  });

  return (
    <div
      className="shwave"
      css={css`
        position: relative;
        display: flex;
        height: 200px;
        // background-color: #529393;
        background-color: #fff;
      `}
    >
      <WaveCanvas shwave={shwave} />
    </div>
  );
};

export default ShWave;
