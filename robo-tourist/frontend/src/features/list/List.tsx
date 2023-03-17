import { useEffect, useState } from "react";
import { MarkerProps, TravelMode } from "../map/interfaces";
import { getPhoto } from "../map/map-utils";
import { formatDistace, formatDuration } from "./utils";
import { travelModeIcons } from "./const";

interface ListProps {
  places: MarkerProps[];
  map: any;
  travelMode: TravelMode;
  onMarkerSelect: (index: number) => void;
  onMarkerDeselect: (index: number) => void;
}

const List: React.FC<ListProps> = ({
  places,
  map,
  travelMode,
  onMarkerSelect,
  onMarkerDeselect,
}) => {
  const [markers, setMarkers] = useState<MarkerProps[]>(places);

  const updatePhotos = async (places: MarkerProps[]) => {
    const urls = (await Promise.allSettled(
      places.map((place) => getPhoto(place.placeId, map))
    )) as any[];
    const newMarkers = places.map((place, index) => ({
      ...place,
      imageUrl: urls[index].value,
    }));
    setMarkers(newMarkers);
  };

  useEffect(() => {
    if (map) updatePhotos(places);
  }, [places, map]);

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
                        src={travelModeIcons[travelMode]}
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
