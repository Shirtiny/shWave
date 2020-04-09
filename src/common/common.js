import { useState, useCallback } from "react";

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
