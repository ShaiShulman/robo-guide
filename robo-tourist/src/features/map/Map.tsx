import { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { getBounds, getPlace } from "./utils";
import { Coord, MarkerProps } from "./interfaces";
import Marker from "./Marker";
import { GOOGLE_MAPS_API_KEY } from "./const";

interface MapProps {
  placeNames: string[];
  onMapLoaded: (places: MarkerProps[], MapsApi: any) => void;
}

const Map: React.FC<MapProps> = ({ placeNames, onMapLoaded }) => {
  const [center, setCenter] = useState<Coord>({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [Map, setMap] = useState(null);
  const [Maps, setMaps] = useState(null);

  const handleApiLoaded = async (map, maps) => {
    setMap(map);
    setMaps(maps);
  };

  useEffect(() => {
    if (placeNames.length === 0 || !Map || !Maps) return;
    const setMap = async () => {
      const geocoder = new Maps.Geocoder();
      const locations = (await Promise.allSettled(
        placeNames.map((place) => getPlace(place, geocoder))
      )) as any[];
      const geometry = locations
        .filter((loc: any) => loc.status === "fulfilled")
        .map((loc: any) => ({
          lat: loc.value.lat,
          lng: loc.value.lng,
        }));
      const avgLat =
        geometry.reduce((acc, geometry: any) => acc + geometry.lat, 0) /
        placeNames.length;
      const avgLng =
        geometry.reduce((acc, geometry: any) => acc + geometry.lng, 0) /
        placeNames.length;
      setCenter({ lat: avgLat, lng: avgLng });
      const markers = placeNames
        .map((place, index) => ({
          text: place,
          lat: locations[index]?.value?.lat,
          lng: locations[index]?.value?.lng,
          placeId: locations[index]?.value?.id,
        }))
        .filter((place) => place.lat && place.lng);
      console.log(markers);
      setMarkers(markers);
      Map.fitBounds(getBounds(geometry));
    };
    console.log(markers);
    setMap().catch((err) => console.error(err));
    onMapLoaded(markers, Map);
  }, [placeNames, Map, Maps]);

  return (
    <div style={{ height: "400px", width: "400px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
        center={center}
        zoom={5}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              lat={marker.lat}
              lng={marker.lng}
              text={marker.text}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
