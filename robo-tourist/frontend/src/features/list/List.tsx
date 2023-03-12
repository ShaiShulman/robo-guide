import { useEffect, useState } from "react";
import { MarkerProps } from "../map/interfaces";
import { getPhoto } from "../map/utils";

interface ListProps {
  places: MarkerProps[];
  map: any;
  onMarkerSelect: (index: number) => void;
  onMarkerDeselect: (index: number) => void;
}

const List: React.FC<ListProps> = ({
  places,
  map,
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
                <h2 className="item-title">{marker.title}</h2>
                <p className="item-description">{marker.desc}</p>
                <p className="item-distance">
                  {marker.route
                    ? `${Math.floor(
                        marker.route.routes[0].legs[0].duration.value / 60
                      )} mnts`
                    : ""}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
