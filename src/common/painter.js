import common from "./common";
import logger from "./logger"

/**
 *@description 绘制背景
 * @param {Object} waveCanvas canvas绘画区
 * @param {Object} ctx 画笔
 * @param {String} backgroundColor 背景色 默认#529393
 */
export const drawBackground = (
  waveCanvas,
  ctx,
  backgroundColor = "#529393"
) => {
  if (!waveCanvas && !ctx) return;
  const { width, height } = waveCanvas;
  //清空一个矩形 (清空上一个背景)
  ctx.clearRect(0, 0, width, height);
  //设置填充绘画的颜色
  ctx.fillStyle = backgroundColor;
  //填充出一个矩形 （绘制背景）
  ctx.fillRect(0, 0, width, height);
};

/**
 * @description 绘制尺子
 * @param {Object} waveCanvas canvas绘画区
 * @param {Object} ctx 画笔
 * @param {number} pixelRatio 屏幕像素比
 * @param {number} duration 时间长度
 * @param {number} currentTime 当前时间
 */
export const drawRuler = (
  waveCanvas,
  ctx,
  pixelRatio = 1,
  duration = 15,
  currentTime= 0
) => {
  if (!waveCanvas && !ctx) return;
  const { width, height } = waveCanvas;
  logger.clog(waveCanvas);
  const fontSize = 11;
  const fontHeight = 15;
  const fontTop = 30;
  //字体
  ctx.font = `${fontSize * pixelRatio}px Arial`;
  //颜色
  ctx.fillStyle = "#fff";
  //尺子单位长度 （有几格
  const length = duration * 10;
  //每格间距
  const gap = width / length;
  logger.clog(width, length, gap, pixelRatio);
  //起始时间
  const begin = Math.floor(currentTime / duration) * duration;
  let second = -1;
  for (let index = 0; index < length; index += 1) {
    if (index % 10 === 0) {
      second += 1;
      ctx.fillRect(index * gap, 0, pixelRatio, fontHeight * pixelRatio);
      ctx.fillText(
        common.durationToTime(begin + second).split(".")[0],
        gap * index - fontSize * pixelRatio * 2 + pixelRatio,
        fontTop * pixelRatio
      );
    } else if (index % 5 === 0) {
      ctx.fillRect(index * gap, 0, pixelRatio, (fontHeight * pixelRatio) / 1.5);
    } else {
      ctx.fillRect(index * gap, 0, pixelRatio, (fontHeight * pixelRatio) / 3);
    }
  }
};

export default {
  drawBackground,
  drawRuler,
};
