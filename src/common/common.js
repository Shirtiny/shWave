import { useState, useCallback } from "react";
import DT from "duration-time-conversion";
import _ from "loadsh";

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

//合并 传入两个unit8数组
export function merge(...buffers) {
  const Constructor = buffers[0].constructor;
  return buffers.reduce((pre, val) => {
      const merge = new Constructor((pre.byteLength | 0) + (val.byteLength | 0));
      merge.set(pre, 0);
      merge.set(val, pre.byteLength | 0);
      return merge;
  }, new Constructor());
}

export default {
  durationToTime,
  throttle,
  merge
};
