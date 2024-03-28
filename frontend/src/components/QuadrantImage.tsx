import React, { FC } from "react";
import "./QuadrantImage.css";

interface QuadrantImageProps {
  urls: string[];
}

const QuadrantImage: FC<QuadrantImageProps> = ({ urls }) => (
  <div className="quadrant-image">
    {urls?.map((url, index) => (
      <img
        key={index}
        src={url}
        className={`quadrant quadrant-${index}`}
        alt=""
      />
    ))}
  </div>
);

export default QuadrantImage;
