import React, { Fragment } from "react";
// import { hot } from "react-hot-loader/root";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ShWave from "./componets/shwave";

const App = () => {
  return (
    <Fragment>
      <div className="container">内容</div>
      <div
        css={css`
          position: relative;
          height: 150px;
        `}
      >
        <ShWave duration={15} backgroundColor={"#529393"} currentTime={1000} throttleWait={2300}/>
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
