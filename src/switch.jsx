import React, { useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { motion } from "framer-motion";

const Switch = () => {
  const [state, setState] = useState(false);
  const handleTap = () => {
    setState(!state);
  };
  return (
    <motion.div
      className="container"
      css={css`
        width: 100px;
        height: 50px;
        background: #ddd;
        border-radius: 50px;
        position: relative;
      `}
      onTap={handleTap}
    >
      <motion.div
        className="ball"
        css={css`
          width: 50px;
          height: 50px;
          background: royalblue;
          border-radius: 50%;
          position: absolute;
          left: ${state ? "unset" : 0};
          right: ${state ? 0 : "unset"};
        `}
        positionTransition
      ></motion.div>
    </motion.div>
  );
};

export default Switch;
