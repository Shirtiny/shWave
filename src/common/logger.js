import config from "../config/config";
const isLog = config.log === "on" ? true : false;

export function clog(...rest) {
  if (!isLog) return;
  console.log(...rest);
}

export default {
  clog,
};
