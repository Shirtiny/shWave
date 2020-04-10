import React, { Fragment, useState } from "react";
// import { hot } from "react-hot-loader/root";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ShWave from "./componets/shwave";
import VideoPlayer from "./componets/videoPlayer";

const App = () => {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <Fragment>
      <div
        className="container"
        css={css`
          height: 600px;
          width: 600px;
        `}
      >
        <VideoPlayer player={player} setPlayer={setPlayer} setCurrentTime={setCurrentTime} />
      </div>
      <div
        css={css`
          position: relative;
          height: 150px;
        `}
      >
        <ShWave
          duration={15}
          backgroundColor={"#529393"}
          currentTime={currentTime}
          throttleWait={2300}
        />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
