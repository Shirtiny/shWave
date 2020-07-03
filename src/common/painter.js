import common from "./common";

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

//获取间距 实际宽度px / (时长 * 10)
function getGap(width, length) {
  return Number(width / length).toFixed(3);
}

//获得开始时间
function getBegin(currentTime, duration) {
  //起始时间
  return Math.floor(currentTime / duration) * duration;
}

//每0.1秒时间轴 对应的像素
function getGapPx(canvasWidth,duration) {
  const pixelRatio = window.devicePixelRatio;
    if (!canvasWidth) return 0;
    const length = getLength(duration);
    //gap : 每格间距多少像素 一格代表0.1s 也就是每0.1s多少px
    const gap = getGap(canvasWidth, length);
    //gap * 像素密度 兼容不同的分辨率得到合适的大小
    const gapPx = gap * pixelRatio;
    return gapPx;
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
  pointerWidth = 2
) => {
  if (!canvas || !ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = color;
  const length = getLength(duration);
  //gap由width得到 不用再使用pixelRatio计算像素了
  const gap = getGap(width, length);
  const begin = getBegin(currentTime, duration);
  ctx.fillRect(
    Number((currentTime - begin) * 10 * gap).toFixed(3),
    0,
    pointerWidth * pixelRatio,
    height
  );
};

export function clamp(num, a, b) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

//绘制音频图 星
const drawWave = (
  canvas,
  ctx,
  duration = 15,
  currentTime = 0,
  sampleRate,
  channelData,
  waveScale = 0.8,
  progress = true,
  progressColor = "#57e3e3",
  waveColor = "#fbf8f86b",
) => {
  const { width, height } = canvas;
  const begin = getBegin(currentTime, duration);
  const length = getLength(duration);
  const gap = getGap(width, length);
  const middle = height / 2;
  const waveWidth = width;
  // sampleRate 采样率 每秒从连续信号中提取并组成离散信号的采样个数
  const startIndex = clamp(begin * sampleRate, 0, Infinity);
  const endIndex = clamp((begin + duration) * sampleRate, startIndex, Infinity);
  const step = Math.floor((endIndex - startIndex) / waveWidth);
  const cursorX = (currentTime - begin) * gap * 10;
  let stepIndex = 0;
  let xIndex = 0;
  let min = 1;
  let max = -1;
  for (let i = startIndex; i < endIndex; i += 1) {
    stepIndex += 1;
    const item = channelData[i] || 0;
    if (item < min) {
      min = item;
    } else if (item > max) {
      max = item;
    }
    if (stepIndex >= step && xIndex < waveWidth) {
      xIndex += 1;
      const waveX = xIndex;
      ctx.fillStyle = progress && cursorX >= waveX ? progressColor : waveColor;
      ctx.fillRect(
        waveX,
        (1 + min * waveScale) * middle,
        1,
        Math.max(1, (max - min) * middle * waveScale)
      );
      stepIndex = 0;
      min = 1;
      max = -1;
    }
  }
};

export default {
  getLength,
  getGap,
  getBegin,
  getGapPx,
  clamp,
  drawBackground,
  drawRuler,
  drawPointer,
  drawWave,
};
