import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="message">{message || "Loading..."}</div>
    </div>
  );
};

export default Spinner;
