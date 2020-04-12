import React, { Component, useState, useCallback, useEffect } from "react";
import WaveCanvas from "./waveCanvas";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import logger from "../common/logger";
import common from "../common/common";
import painter from "../common/painter";

class ShWave extends Component {
  state = { shwave: null, waveCanvas: null, audioData: null };

  //回调ref react会自动在挂载时传入对应dom对象，卸载时传入null
  $shwave = (shwave) => {
    if (shwave !== null) {
      this.setState({ shwave });
    }
  };

  //callback-refs 初始化时 获取canvas对象
  $canvas = (waveCanvas) => {
    if (waveCanvas !== null) {
      logger.clog("更新canvas，并且重设canvas宽高", waveCanvas);
      this.setState({ waveCanvas }, () => {
        this.updateCanvas();
      });
      //设置resize窗口监听
      window.addEventListener("resize", this.onResize);
    } else {
      //取消resize监听
      window.removeEventListener("resize", this.onResize);
    }
  };

  //更新canvas宽高
  updateCanvas = () => {
    const { shwave, waveCanvas } = this.state;
    if (!waveCanvas || !shwave) return;
    const { clientHeight, clientWidth } = shwave;
    logger.clog("更新宽高", clientWidth, clientHeight);
    //获取像素比
    const pixelRatio = window.devicePixelRatio;
    waveCanvas.width = clientWidth * pixelRatio;
    waveCanvas.height = clientHeight * pixelRatio;
  };

  //更新音频数据
  updateAudioData = (audioData) => {
    this.setState({ audioData });
  };

  // 绘画
  draw = () => {
    const { waveCanvas } = this.state;
    const {
      duration,
      backgroundColor,
      currentTime,
      pointerColor,
      pointerWidth,
      waveColor,
      alterWaveColor,
      waveScale
    } = this.props;
    //像素比
    const pixelRatio = window.devicePixelRatio;
    const ctx = waveCanvas && waveCanvas.getContext("2d");
    logger.clog("绘制", currentTime);
    if (!waveCanvas || !ctx) return;
    //绘制背景
    painter.drawBackground(waveCanvas, ctx, backgroundColor);
    //绘制尺子
    painter.drawRuler(waveCanvas, ctx, pixelRatio, duration, currentTime);
    //绘制指针
    painter.drawPointer(
      waveCanvas,
      ctx,
      pixelRatio,
      duration,
      currentTime,
      pointerColor,
      pointerWidth
    );
    //绘制音频
    if (!this.state.audioData) return;
    const { sampleRate } = this.state.audioData;
    const channelData = this.state.audioData.getChannelData(0);
    painter.drawWave(
      waveCanvas,
      ctx,
      duration,
      currentTime,
      sampleRate,
      channelData,
      waveScale,
      true,
      alterWaveColor,
      waveColor,
      0
    );
  };

  //resize
  onResize = common.throttle(() => {
    this.updateCanvas();
    this.draw();
  }, this.props.throttleWait || 300);

  componentDidMount() {}

  render() {
    const { currentTime, url } = this.props;
    return (
      <div
        ref={this.$shwave}
        className="shwave"
        css={css`
          position: relative;
          display: flex;
          height: 100%;
          width: 100%;
          // background-color: #529393;
          background-color: #fff;
        `}
      >
        <WaveCanvas
          $canvas={this.$canvas}
          waveCanvas={this.state.waveCanvas}
          draw={this.draw}
          currentTime={currentTime}
          url={url}
          audioData={this.state.audioData}
          updateAudioData={this.updateAudioData}
        />
      </div>
    );
  }
}

// const ShWave = ({ duration = 0 }) => {

// };

export default ShWave;
