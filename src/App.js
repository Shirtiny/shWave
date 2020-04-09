import React, { Fragment } from "react";
import { hot } from "react-hot-loader/root";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Switch from "./switch.jsx";

const App = () => {
  return (
    <Fragment>
      <div
        css={css`
          width: 100vw;
          height: 100vh;
          display: grid;
          place-items: center;
        `}
      >
        <Switch />
      </div>
    </Fragment>
  );
};

export default hot(App);
