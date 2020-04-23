import React, { Component } from "react";
import WaveCanvas from "./waveCanvas";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import common from "../common/common";
import painter from "../common/painter";
import SubBlocks from "./subBlocks";

class ShWave extends Component {
  state = {
    shwave: null,
    waveCanvas: null,
    audioData: null,
    canvasWidth: 0,
  };

  //回调ref react会自动在挂载时传入对应dom对象，卸载时传入null
  $shwave = (shwave) => {
    if (shwave !== null) {
      this.setState({ shwave });
    }
  };

  //callback-refs 初始化时 获取canvas对象
  $canvas = (waveCanvas) => {
    if (waveCanvas !== null) {
      this.setState({ waveCanvas }, () => {
        this.updateCanvas();
      });
      const { click } = this.props;
      //设置resize窗口监听
      window.addEventListener("resize", this.onResize);
      //设置canvas点击监听
      waveCanvas.addEventListener("click", this.onCanavsClick);
      //禁用canvas原生右键
      waveCanvas.oncontextmenu = () => {
        return false;
      };
      //设置canvas右键监听
      waveCanvas.addEventListener("contextmenu", this.onCanvasContextmenu);
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
    //获取像素比
    const pixelRatio = window.devicePixelRatio;
    waveCanvas.width = clientWidth * pixelRatio;
    waveCanvas.height = clientHeight * pixelRatio;
    //更新canvasWidth
    const canvasWidth = waveCanvas.width;
    this.setState({ canvasWidth });
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
      waveScale,
    } = this.props;
    //像素比
    const pixelRatio = window.devicePixelRatio;
    const ctx = waveCanvas && waveCanvas.getContext("2d");
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

  //从canvas点击事件 计算time 星
  computeTimeFromEvent(event) {
    const { currentTime, duration } = this.props;
    const { shwave, waveCanvas } = this.state;
    const { width, height } = waveCanvas;
    const pixelRatio = window.devicePixelRatio;
    const length = painter.getLength(duration);
    const gap = painter.getGap(width, length);
    const left = painter.clamp(
      event.pageX - shwave.offsetLeft / pixelRatio,
      0,
      Infinity
    );
    const begin = painter.getBegin(currentTime, duration);
    const time = painter.clamp(
      ((left / gap) * pixelRatio) / 10 + begin,
      begin,
      begin + duration
    );
    return time;
  }

  //canvas click
  onCanavsClick = (event) => {
    const time = this.computeTimeFromEvent(event);
    const { currentTime, url, click } = this.props;
    if (url && currentTime !== time) {
      click(time, event);
      this.draw();
    }
  };

  //canvas contextmenu 右键
  onCanvasContextmenu = (event) => {
    const time = this.computeTimeFromEvent(event);
    const { url, currentTime, contextmenu } = this.props;
    if (url && currentTime !== time) {
      contextmenu(time, event);
      this.draw();
    }
  };

  render() {
    const {
      currentTime,
      url,
      duration,
      subArray,
      onSubMove,
      onSubMoveError,
      onSubResize
    } = this.props;
    //当前canvas的起始时间
    const begin = painter.getBegin(currentTime, duration);
    return (
      <div
        ref={this.$shwave}
        className="shwave"
        css={css`
          position: relative;
          display: flex;
          height: 100%;
          width: 100%;
        `}
      >
        {subArray && (
          <SubBlocks
            duration={duration}
            begin={begin}
            subArray={subArray}
            canvasWidth={this.state.canvasWidth}
            onSubMove={onSubMove}
            onSubMoveError={onSubMoveError}
            onSubResize={onSubResize}
          />
        )}
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
