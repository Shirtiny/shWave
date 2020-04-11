import React, { useCallback, useEffect } from "react";
import logger from "../common/logger";

const Parse = ({ url }) => {
  const fetchMedia = useCallback(() => {
    logger.clog("fetch url ：", url);
  }, [url]);

  useEffect(() => {
    fetchMedia();
  }, [url]);

  return null;
};

export default Parse;
