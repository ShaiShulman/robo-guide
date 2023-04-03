import { formatDistace, formatDuration } from "./utils";
import { travelModeIcons } from "./const";
import { selectImages, selectMarkers } from "../../store/markerSlice";
import { useSelector } from "react-redux";
import { selectPrompt } from "../../store/promptSlice";
import { selectView, viewActions } from "../../store/viewSlice";
import getDispatch from "../../lib/get-dispatch";
import React, { useEffect, useMemo } from "react";
import { ensureElementVisible } from "../../utils/views-utils";
import ImgPlaceholder from "../../components/ImgPlaceholder";

interface ListProps {
  map: any;
}

const List: React.FC<ListProps> = ({ map }) => {
  const dispatch = getDispatch();

  const markers = useSelector(selectMarkers);
  const images = useSelector(selectImages);
  const promptInfo = useSelector(selectPrompt);
  const view = useSelector(selectView);
  const refsMarkers = useMemo(
    () => markers.map((m) => React.createRef<HTMLDivElement>()),
    [markers]
  );

  useEffect(() => {
    if (view.selected !== null)
      ensureElementVisible(refsMarkers[view.selected]);
  }, [view.selected]);

  return (
    <div className="list-section">
      <ul>
        {markers.map((marker, index) => (
          <li
            key={index}
            onClick={() =>
              dispatch(
                viewActions.setSelected(view.selected === index ? null : index)
              )
            }
          >
            <div
              className={`list-item ${
                view.selected === index ? "selected" : ""
              } ${!view.compact || view.selected === index ? "expanded" : ""}`}
              ref={refsMarkers[index]}
            >
              <div className="place-image">
                <ImgPlaceholder src={marker.imageUrl} />
              </div>
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
                      {formatDuration(marker.routeDuration)} |
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
