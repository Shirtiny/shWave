import React, { Component } from "react";
import DPlayer from "react-dplayer";
import flvjs from "flv.js";
import logger from "../common/logger";

class VideoPlayer extends Component {
  load = (player) => {
    const { setPlayer, setCurrentTime } = this.props;
    setPlayer(player);
    //1秒60帧 根据屏幕刷新虑有所变化，time为时间戳 ，每一帧的工作内容为：
    function frameWork(time) {
      //如果视频没有暂停 下一帧继续调用frameWork
      //更新当前时间
      setCurrentTime(player.video.currentTime);
      window.requestAnimationFrame(frameWork);
    }
    //作为启动
    window.requestAnimationFrame(frameWork);
  };

  //播放中
  playing = () => {};

  render() {
    // const videoUrl = "https://sh-rep.oss-cn-hongkong.aliyuncs.com/mll.mp4";
    return (
      <div id="playerBox" className="box">
        <DPlayer
          id="player"
          className={"playerBorder "}
          style={{ resize: "both" }}
          options={{
            video: {
              url: "",
              customType: {
                flvCustom: function (videoElement, player) {
                  logger.clog("支持flv");
                  if (flvjs.isSupported()) {
                    const flvPlayer = flvjs.createPlayer({
                      type: "flv",
                      url: videoElement.src,
                      hasAudio: true,
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                  }
                },
              },
            },
            theme: "#ccc",
            loop: true,
          }}
          onLoad={this.load}
          onPlaying={this.playing}
        />
      </div>
    );
  }
}

export default VideoPlayer;
