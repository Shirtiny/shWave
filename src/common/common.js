import { useState, useCallback } from "react";
import DT from "duration-time-conversion";
import _ from "loadsh";
import logger from "./logger";

function useClientRect(fn) {
  const [rect, setRect] = useState(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
      fn();
    }
  }, []);
  return [rect, ref];
}

export function durationToTime(duration = 0) {
  return DT.d2t(duration.toFixed(3));
}

//节流函数
export function throttle(fn, wait, option = { trailing: true }) {
  return _.throttle(fn, wait, option);
}

//合并 比如：传入两个unit8数组
export function merge(...buffers) {
  //获取第一个unit数组的构造函数
  const Constructor = buffers[0].constructor;
  return buffers.reduce((pre, val) => {
    //新建一个数组 长度为两个数组的长度和
    const merge = new Constructor((pre.byteLength | 0) + (val.byteLength | 0));
    merge.set(pre, 0);
    merge.set(val, pre.byteLength | 0);
    return merge;
  }, new Constructor());
}

//AudioContext可以控制它所包含的节点的创建，以及音频处理、解码操作的执行 var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//解析媒体数据 返回解析后的音频
export async function decodeMediaData(data) {
  if (!data) return;
  return audioCtx.decodeAudioData(data.buffer).then((decodedBuffer) => {
    logger.clog("decodedAudio", decodedBuffer, "decode后的data有多个channel");
    logger.clog("channelData 0", decodedBuffer.getChannelData(0));
    logger.clog("channelData 1", decodedBuffer.getChannelData(1));
    return decodedBuffer;
  });
}

export default {
  durationToTime,
  throttle,
  merge,
  decodeMediaData,
};
