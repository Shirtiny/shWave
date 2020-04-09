import React, { Fragment } from "react";
// import { hot } from "react-hot-loader/root";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ShWave from "./componets/shwave";

const App = () => {
  return (
    <Fragment>
      <div className="container">内容</div>
      <div>
        <ShWave />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
