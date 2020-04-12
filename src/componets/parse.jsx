import React, { useCallback, useEffect, useState } from "react";
import logger from "../common/logger";
import common from "../common/common";

const Parse = ({ url, drawWave, updateAudioData }) => {
  //数据大小
  const [dataSize, setDataSize] = useState(0);
  //data为Uint8Array 8位无符号整型数组
  const [data, setData] = useState(null);
  //解析后的音频数据 decodedBuffer
  // const [audioData, setAudioData] = useState(null);

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
        //使用reader读取二进制数据  "done"是一个布尔型，"value"是一个Unit8Array
        reader.read().then(function read({ done, value }) {
          if (done) {
            logger.clog("载入完成：", data);
            setData(data);
            return;
          }
          logger.clog("载入ing：", data);
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
    logger.clog("decodeAudio:", data);
    //解析数据
    try {
      const audioData = await common.decodeMediaData(data);
      //更新解析后的音频数据
      logger.clog("audioData:", audioData);
      updateAudioData(audioData);
    } catch (e) {
      logger.clog("解析出错", e);
      //将音频置空
      updateAudioData(null);
    }
  }, [data]);

  useEffect(() => {
    //拉取数据
    fetchMedia();
  }, [url]);

  useEffect(() => {
    logger.clog("useEffect data:", data);
    if (data === null) return;
    //解析数据
    decodeAudio();
  }, [data]);

  // useEffect(() => {
  //   logger.clog("useEffect audioData", audioData, currentTime);
  //   if (audioData === null) return;
  //   //根据音频数据 绘图
  //   const sampleRate = audioData.sampleRate;
  //   const channelData = audioData.getChannelData(0);
  //   drawWave(sampleRate, channelData);
  // },[audioData,currentTime]);

  return null;
};

export default Parse;
