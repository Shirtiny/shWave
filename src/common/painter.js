import common from "./common";
import logger from "./logger";

/**
 *@description 绘制背景
 * @param {Object} canvas canvas绘画区
 * @param {Object} ctx 画笔
 * @param {String} backgroundColor 背景色 默认#529393
 */
export const drawBackground = (canvas, ctx, backgroundColor = "#529393") => {
  if (!canvas || !ctx) return;
  const { width, height } = canvas;
  //清空一个矩形 (清空上一个背景)
  ctx.clearRect(0, 0, width, height);
  //设置填充绘画的颜色
  ctx.fillStyle = backgroundColor;
  //填充出一个矩形 （绘制背景）
  ctx.fillRect(0, 0, width, height);
};

//获取总长度 （共有多少格） 1秒=1大格=10个小格 duration是尺子表示的时长 单位s
function getLength(duration) {
  return duration * 10;
}

//获取间距 实际宽度px / 时长 * 10
function getGap(width, length) {
  return Number(width / length).toFixed(3);
}

//获得开始时间
function getBegin(currentTime, duration) {
  //起始时间
  return Math.floor(currentTime / duration) * duration;
}

/**
 * @description 绘制尺子
 * @param {Object} canvas canvas绘画区
 * @param {Object} ctx 画笔
 * @param {number} pixelRatio 屏幕像素比
 * @param {number} duration 时间长度
 * @param {number} currentTime 当前时间
 */
export const drawRuler = (
  canvas,
  ctx,
  pixelRatio = 1,
  duration = 15,
  currentTime = 0
) => {
  if (!canvas || !ctx) return;
  const { width, height } = canvas;
  const fontSize = 11;
  const fontHeight = 15;
  const fontTop = 30;
  //字体
  ctx.font = `${fontSize * pixelRatio}px Arial`;
  //颜色
  ctx.fillStyle = "#fff";
  //尺子单位长度 （有几格
  const length = getLength(duration);
  //每格间距
  const gap = getGap(width, length);
  logger.clog("宽 长 每格间距像素 像素比", width, length, gap, pixelRatio);
  //起始时间
  const begin = getBegin(currentTime, duration);
  let second = -1;
  for (let index = 0; index < length; index += 1) {
    //十格间距
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

/**
 * @description 画指针
 * @param {*} canvas canvas画布
 * @param {*} ctx 画笔
 * @param {*} pixelRatio 像素比
 * @param {*} duration 单位s
 * @param {*} currentTime 当前时间，单位s
 * @param {*} color 指针颜色
 */
export const drawPointer = (
  canvas,
  ctx,
  pixelRatio = 1,
  duration = 15,
  currentTime = 0,
  color,
  pointerWidth = 2,
) => {
  if (!canvas || !ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = color;
  const length = getLength(duration);
  const gap = getGap(width, length);
  const begin = getBegin(currentTime, duration);
  logger.clog(
    "指针位置",
    Number((currentTime - begin) * pixelRatio * 10 * gap).toFixed(3)
  );
  ctx.fillRect(
    Number((currentTime - begin) * pixelRatio * 10 * gap).toFixed(3),
    0,
    pointerWidth * pixelRatio,
    height
  );
  
};

export default {
  drawBackground,
  drawRuler,
  drawPointer,
};
