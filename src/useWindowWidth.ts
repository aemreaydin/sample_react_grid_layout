import { useState, useLayoutEffect } from "react";

const getBoundingClientRect = (
  ref?: React.MutableRefObject<HTMLDivElement>
) => {
  if (ref?.current) {
    console.log("Current");
    return ref.current.getBoundingClientRect();
  }
  return document.body.getBoundingClientRect();
};

export default function useWindowDimensions(ref?: React.MutableRefObject<any>) {
  const [{ width, height }, setDimensions] = useState(getBoundingClientRect());

  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions(getBoundingClientRect(ref));
      }, 150);
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [ref]);

  useLayoutEffect(() => {
    console.log("Initial Mount");
    setDimensions(getBoundingClientRect(ref));
  }, [ref]);

  return [width, height];
}
