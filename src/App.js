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
        <ShWave duration={15} backgroundColor={"#529393"} currentTime={0} />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
