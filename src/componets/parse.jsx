import React, { useCallback, useEffect, useState } from "react";
import logger from "../common/logger";
import common from "../common/common";

const Parse = ({ url }) => {
  const [dataSize, setDataSize] = useState(0);
  //data为Uint8Array 8位无符号整型数组
  const [data, setData] = useState(null);

  const fetchMedia = useCallback(() => {
    if (!url) return;
    logger.clog("fetch url ：", url);
    let reader = null;
    fetch(url, {}).then((res) => {
      //如果res.body是流
      if (res.body && typeof res.body.getReader === "function") {
        const fileSize = res.headers.get("content-length");
        setDataSize(fileSize);
        logger.clog(res, fileSize);
        //获取 ReadableStream 的 reader , ReadableStream接口呈现了一个可读取的二进制流操作 Fetch 通过Response的属性 body提供了一个具体的 ReadableStream 对象。
        reader = res.body.getReader();
        // 8位无符号整型数组 Uint8Array与可读流ReadableStream 的协同用法。
        let data = new Uint8Array();
        // "done"是一个布尔型，"value"是一个Unit8Array
        reader.read().then(function read({ done, value }) {
          if (done) {
            logger.clog("载入完成：", data);
            setData(data);
            return;
          }
          logger.clog("载入ing：", data);
          data = common.merge(data, value);
          //递归
          return reader.read().then(read);
        });
      }
    });
  }, [url, setDataSize, setData]);

  useEffect(() => {
    //拉取数据
    fetchMedia();
  }, [url]);

  useEffect(() => {
    logger.clog("useEffect data:", data);
  });

  return null;
};

export default Parse;
