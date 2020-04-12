import React, { Fragment, useState, useCallback } from "react";
// import { hot } from "react-hot-loader/root";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ShWave from "./componets/shwave";
import VideoPlayer from "./componets/videoPlayer";

const App = () => {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [url, setUrl] = useState("");

  const handleVideoFile = useCallback(
    (e) => {
      URL.revokeObjectURL(url);
      const file = e.currentTarget.files[0];
      const videoUrl = URL.createObjectURL(file);
      setUrl(videoUrl);
      const videoRegx = /^video\/(mp4|x-(flv))+$/;
      const found = file.type.match(videoRegx);
      const videoType =
        found && found[2] ? found[2] + "Custom" : found ? found[1] : "";
      player.switchVideo({
        url: videoUrl,
        type: videoType,
      });
    },
    [url, setUrl, player]
  );

  return (
    <Fragment>
      <div
        className="container"
        css={css`
          height: 600px;
          width: 600px;
        `}
      >
        <VideoPlayer
          url={url}
          player={player}
          setPlayer={setPlayer}
          setCurrentTime={setCurrentTime}
        />
        <input
          className="uploadVideo"
          type="file"
          name="file"
          onChange={handleVideoFile}
        />
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
          pointerColor={"#ddd"}
          pointerWidth={3}
          waveColor={"#fbf8f86b"}
          alterWaveColor={"#57e3e3"}
          waveScale={2}
          currentTime={currentTime}
          throttleWait={300}
          url={url}
        />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
