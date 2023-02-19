import { MarkerProps } from "./interfaces";
import "./map.css";

const Marker: React.FC<MarkerProps> = (props) => {
  return (
    <div>
      <div
        className="pin bounce"
        style={{ backgroundColor: "blue", cursor: "pointer" }}
        title={props.text}
      />
      <div className="marker-caption">{props.text}</div>
      <div className="pulse" />
    </div>
  );
};

export default Marker;
