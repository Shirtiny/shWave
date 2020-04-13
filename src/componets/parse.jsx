import React, { useCallback, useEffect, useState } from "react";
import common from "../common/common";

const Parse = ({ url, drawWave, updateAudioData }) => {
  //数据大小
  const [dataSize, setDataSize] = useState(0);
  //data为Uint8Array 8位无符号整型数组
  const [data, setData] = useState(null);

  const fetchMedia = useCallback(() => {
    if (!url) return;
    let abortController = new AbortController();
    let reader = null;
    fetch(url, { signal: abortController.signal }).then((res) => {
      //如果res.body是流
      if (res.body && typeof res.body.getReader === "function") {
        const fileSize = res.headers.get("content-length");
        setDataSize(fileSize);
        //获取 ReadableStream 的 reader , ReadableStream接口呈现了一个可读取的二进制流操作 Fetch 通过Response的属性 body提供了一个具体的 ReadableStream 对象。
        reader = res.body.getReader();
        // 8位无符号整型数组 Uint8Array与可读流ReadableStream 的协同用法。
        let data = new Uint8Array();
        //使用reader读取二进制数据  "done"是一个布尔型，"value"是一个Unit8Array
        reader.read().then(function read({ done, value }) {
          if (done) {
            abortController.abort();
            reader.cancel();
            abortController = null;
            reader = null;
            setData(data);
            return;
          }
          //合并两个unit8数组 (累加data
          data = common.merge(data, value);
          //递归
          return reader.read().then(read);
        });
      }
    });
  }, [url, setDataSize, setData]);

  //获取到data后执行 从data解析音频
  const decodeAudio = useCallback(async () => {
    //解析数据
    try {
      const audioData = await common.decodeMediaData(data);
      //更新解析后的音频数据
      updateAudioData(audioData);
    } catch (e) {
      //将音频置空
      updateAudioData(null);
    }
  }, [data]);

  useEffect(() => {
    //拉取数据
    fetchMedia();
  }, [url]);

  useEffect(() => {
    if (data === null) return;
    //解析数据
    decodeAudio();
  }, [data]);

  return null;
};

export default Parse;
