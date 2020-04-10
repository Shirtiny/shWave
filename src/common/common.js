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
export function throttle(fn, wait, option = {}) {
  return _.throttle(fn, wait, option);
}

export default {
  durationToTime,
  throttle
};
