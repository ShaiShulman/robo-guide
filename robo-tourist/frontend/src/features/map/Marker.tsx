import { MarkerProps } from "./interfaces";
import "./map.css";

const Marker: React.FC<MarkerProps> = (props) => {
  return (
    <div>
      <div
        className="pin bounce"
        style={{ backgroundColor: "blue", cursor: "pointer" }}
        title={props.title}
      />
      <div className="marker-caption">{props.title}</div>
      <div className="pulse" />
    </div>
  );
};

export default Marker;
