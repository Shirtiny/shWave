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
  const [subArray, setSubArray] = useState([
    {
      content: "1号",
      end: 0.999,
      length: 0.999,
      start: 0,
    },
    {
      content: "2号",
      end: 6.999,
      length: 1.999,
      start: 5,
    },
    {
      content: "3号",
      end: 14.999,
      length: 4.999,
      start: 10,
    },
    {
      content: "4号",
      end: 18,
      length: 3,
      start: 15,
    },
  ]);

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

  //canvas 右键
  const contextmenu = useCallback(
    (time, event) => {
      if (!player) return;
      player.play();
      player.seek(time);
    },
    [player]
  );

  //canvas 左键
  const click = useCallback(
    (time, event) => {
      if (!player) return;
      player.pause();
      player.seek(time);
    },
    [player]
  );

  //sub块被移动时
  const handleSubMove = useCallback((originSub, translateSecond) => {
    console.log("收到移动", originSub, translateSecond);
    const subs = [...subArray];
    const index = subs.indexOf(originSub);
    const sub = subs[index];
    sub.start += translateSecond;
    sub.end += translateSecond;
    setSubArray(subs);
  });

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
          waveScale={0.8}
          currentTime={currentTime}
          throttleWait={300}
          url={url}
          click={click}
          contextmenu={contextmenu}
          subArray={subArray}
          onSubMove={handleSubMove}
        />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
