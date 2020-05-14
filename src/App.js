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
      content: "content 1",
      end: 0.999,
      length: 0.999,
      start: 0,
    },
    {
      content: `content 2
      content 2 2
      content 2 4
      content 2 e
      content 2 e`,
      end: 6.999,
      length: 1.999,
      start: 5,
    },
    {
      content: `sdddddddddddddddddddddddddddddddddddd`,
      end: 14.999,
      length: 4.999,
      start: 10,
    },
    {
      content: "content 4",
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

  const contextmenu = useCallback(
    (time, event) => {
      if (!player) return;
      player.play();
      player.seek(time);
    },
    [player]
  );

  const click = useCallback(
    (time, event) => {
      if (!player) return;
      player.pause();
      player.seek(time);
    },
    [player]
  );

  const handleSubClick = useCallback((sub) => {
    console.log(sub);
  });

  const handleSubMove = useCallback((originSub, translateSecond) => {
    const subs = [...subArray];
    const index = subs.indexOf(originSub);
    const sub = { ...subs[index] };
    sub.start += translateSecond;
    sub.end += translateSecond;
    subs[index] = sub;
    console.log("update subArray");
    setSubArray(subs);
  });

  const handleSubMoveError = useCallback(() => {
    console.log("警告");
  });

  const handleSubResize = useCallback((originSub, translateSecond, type) => {
    const subs = [...subArray];
    const index = subs.indexOf(originSub);
    const sub = { ...subs[index] };
    if (type === "start") {
      sub.start += translateSecond;
    } else {
      sub.end += translateSecond;
    }
    sub.length = sub.end - sub.start;
    subs[index] = sub;
    console.log("update subArray");
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
          onSubClick={handleSubClick}
          onSubMove={handleSubMove}
          onSubMoveError={handleSubMoveError}
          ErrorThrottleWait={2000}
          onSubResize={handleSubResize}
          subBlockClass={"mySubBlockClass"}
        />
      </div>
    </Fragment>
  );
};

// export default hot(App);
export default App;
