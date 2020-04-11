import React, { useCallback, useEffect, useState } from "react";
import logger from "../common/logger";
import common from "../common/common";

const Parse = ({ url }) => {
  const [dataSize, setDataSize] = useState(0);
  const [data, setData] = useState(new Uint8Array());

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
        reader = res.body.getReader();
        let data = new Uint8Array();
        reader.read().then(function read({ done, value }) {
          if (done) {
            logger.clog("载入完成：", data);
            setData(data);
            return;
          }
          logger.clog("载入ing：", data);
          data = common.merge(data, value);
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
