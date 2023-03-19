import { useEffect, useState } from "react";
import { MarkerInfo, TravelMode } from "../../globals/interfaces";
import { getPhoto } from "../map/map-utils";
import { formatDistace, formatDuration } from "./utils";
import { travelModeIcons } from "./const";
import { markersActions, selectMarkers } from "../../store/markerSlice";
import { useSelector } from "react-redux";
import { selectPrompt } from "../../store/promptSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

interface ListProps {
  map: any;
  onMarkerSelect: (index: number) => void;
  onMarkerDeselect: (index: number) => void;
}

const List: React.FC<ListProps> = ({
  map,
  onMarkerSelect,
  onMarkerDeselect,
}) => {
  const markers = useSelector(selectMarkers);
  const promptInfo = useSelector(selectPrompt);

  const dispatch: AppDispatch = useDispatch();

  const updatePhotos = async (places) => {
    const urls = (await Promise.allSettled(
      places.map((place) => getPhoto(place.placeId, map))
    )) as any[];
    const newMarkers = places.map((place, index) => ({
      ...place,
      imageUrl: urls[index].value,
    }));
    console.log(newMarkers);
    dispatch(markersActions.create(newMarkers));
  };

  useEffect(() => {
    if (map) updatePhotos(markers);
  }, [markers, map]);

  return (
    <div className="list-section">
      <ul>
        {markers.map((marker, index) => (
          <li
            key={index}
            onMouseEnter={() => onMarkerSelect(index)}
            onMouseLeave={() => onMarkerDeselect(index)}
          >
            <div className="list-item">
              <img srcSet={marker.imageUrl} />
              <div className="item-info">
                <h2 className="item-title">
                  {marker.title}
                  {marker.placeId}
                </h2>
                <div className="item-description">{marker.desc}</div>
                <div className="item-distance corner-item">
                  {marker.route && (
                    <>
                      <img
                        className="text-icon"
                        src={travelModeIcons[promptInfo.travelMode]}
                      />
                      {formatDuration(
                        marker.route.routes[0].legs[0].duration.value
                      )}{" "}
                      minutes |{" "}
                      {formatDistace(
                        marker.route.routes[0].legs[0].distance.value
                      )}
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
