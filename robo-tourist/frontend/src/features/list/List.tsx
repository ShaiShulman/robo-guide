import { formatDistace, formatDuration } from "./utils";
import { travelModeIcons } from "./const";
import { selectImages, selectMarkers } from "../../store/markerSlice";
import { useSelector } from "react-redux";
import { selectPrompt } from "../../store/promptSlice";
import dispatch from "../../lib/get-dispatch";
import { selectView, viewActions } from "../../store/viewSlice";
import getDispatch from "../../lib/get-dispatch";

interface ListProps {
  map: any;
}

const List: React.FC<ListProps> = ({ map }) => {
  const dispatch = getDispatch();

  const markers = useSelector(selectMarkers);
  const images = useSelector(selectImages);
  const promptInfo = useSelector(selectPrompt);
  const view = useSelector(selectView);

  return (
    <div className="list-section">
      <ul>
        {markers.map((marker, index) => (
          <li
            key={index}
            onMouseEnter={() => dispatch(viewActions.setSelected(index))}
            onMouseLeave={() => dispatch(viewActions.setSelected(index))}
          >
            <div
              className={`list-item ${
                view.selected === index ? "selected" : ""
              }`}
            >
              <img srcSet={marker.imageUrl} />
              <div className="item-info">
                <h2 className="item-title">{marker.title}</h2>
                <div className="item-description">{marker.desc}</div>
                <div className="item-distance corner-item">
                  {marker.routeDistance && (
                    <>
                      <img
                        className="text-icon"
                        src={travelModeIcons[promptInfo.travelMode]}
                      />
                      {formatDuration(marker.routeDuration)} minutes |
                      {formatDistace(marker.routeDistance)}
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
