import { useEffect, useState } from "react";
import { MarkerProps } from "../map/interfaces";
import { getPhoto } from "../map/utils";
import { getPlacePhotoUrl } from "./utils";

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
      imageUrl: urls[index],
    }));
    console.log(newMarkers);
    setMarkers(newMarkers);
  };

  useEffect(() => {
    updatePhotos(places);
    return () => {};
  }, [places]);

  return (
    <div className="list-section">
      <ul>
        {places.map((place, index) => (
          <li key={index}>
            <div className="list-item">
              <img src={place.imageUrl} />
              <div className="text">{place.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
