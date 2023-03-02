import { useEffect, useState } from "react";
import { MarkerProps } from "../map/interfaces";
import { getPhoto } from "../map/utils";
import { getPlaceName, getPlacePhotoUrl } from "./utils";

interface ListProps {
  places: MarkerProps[];
  map: any;
}

const List: React.FC<ListProps> = ({ places, map }) => {
  const [markers, setMarkers] = useState<MarkerProps[]>(places);

  const updatePhotos = async (places: MarkerProps[]) => {
    const urls = (await Promise.allSettled(
      places.map((place) => getPhoto(place.placeId, map))
    )) as any[];
    const newMarkers = places.map((place, index) => ({
      ...place,
      imageUrl: urls[index].value,
    }));
    console.log(newMarkers);
    setMarkers(newMarkers);
  };

  useEffect(() => {
    if (map) updatePhotos(places);
  }, [places, map]);

  return (
    <div className="list-section">
      <ul>
        {markers.map((marker, index) => (
          <li key={index}>
            <div className="list-item">
              <img srcSet={marker.imageUrl} />
              <div className="text">{getPlaceName(marker.text)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
