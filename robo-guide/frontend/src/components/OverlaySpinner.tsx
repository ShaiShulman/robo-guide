import React from "react";
import "./spinner.css";

const OverlaySpinner: React.FC<React.PropsWithChildren<{}>> = (props) => (
  <div className="spinner-container-overlay">
    <div className="spinner" />
    <div className="children-container">{props.children}</div>
  </div>
);

export default OverlaySpinner;
