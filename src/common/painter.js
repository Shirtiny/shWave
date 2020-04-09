/**
 *绘制背景
 * @param {Object} waveCanvas canvas绘画区
 * @param {Object} ctx 画笔
 * @param {String} backgroundColor 背景色 默认#529393
 */
const drawBackground = (waveCanvas, ctx, backgroundColor = "#529393") => {
  if (!waveCanvas && !ctx) return;
  const { width, height } = waveCanvas;
  //清空一个矩形 (清空上一个背景)
  ctx.clearRect(0, 0, width, height);
  //设置填充绘画的颜色
  ctx.fillStyle = backgroundColor;
  //填充出一个矩形 （绘制背景）
  ctx.fillRect(0, 0, width, height);
};

export default {
  drawBackground,
};
