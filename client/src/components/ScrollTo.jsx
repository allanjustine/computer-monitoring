import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTo = ({ divRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    divRef?.current?.scrollTo(0, 0);
  }, [pathname, divRef]);

  return null;
};

export default ScrollTo;
