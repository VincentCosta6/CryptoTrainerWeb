import React, { useEffect, useRef } from "react";
import uPlot from "uplot";
import "./myplot.css";

export default (props: any) => {
  const plotRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
      if (plotRef && plotRef.current) {
        new uPlot(props.options, props.data, plotRef.current);

      }
  }, []);

  return (
    <div>
      <div ref={plotRef} />
    </div>
  );
}