import React from "react";
import "./spinner.css";
import workingImg from "../assets/working-robot.png";

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="message">
        {message.split("\\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="spinner-image">
        <img src={workingImg} />
      </div>
    </div>
  );
};

export default Spinner;
