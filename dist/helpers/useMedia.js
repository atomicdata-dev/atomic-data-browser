import React from "../pkg/react.js";
export const useViewport = () => {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  return width;
};
