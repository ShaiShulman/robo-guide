import { useEffect, useMemo, useRef, useState } from "react";
import { getBounds, getPlace } from "./utils";
import { Coord, MarkerProps } from "./interfaces";
import { Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "./const";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { Spinner } from "react-bootstrap";

interface MapProps {
  placeNames: string[];
  targetName: string;
  onMapLoaded: (places: MarkerProps[], Map: any) => void;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({ placeNames, targetName, onMapLoaded }) => {
  const [center, setCenter] = useState<Coord>({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [Map, setMap] = useState(null);
  const [Maps, setMaps] = useState(null);

  const containerStyle = {
    width: "800px",
    height: "300px",
  };

  const windowWidth = useRef(window.innerWidth);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const renderMap = () => {
    const onLoad = (map: any) => {
      setMap(map);
    };

    return (
      <GoogleMap
        mapContainerStyle={{
          height: "300px",
          width: windowWidth.current,
        }}
        onLoad={onLoad}
        center={center}
        zoom={5}
      >
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.text}
            />
          );
        })}
      </GoogleMap>
    );
  };

  useEffect(() => {
    if (placeNames.length === 0 || !Map) return;
    const setMap = async () => {
      const geocoder = new google.maps.Geocoder();
      const locations = (await Promise.allSettled(
        placeNames.map((place) => getPlace(`${place}, ${targetName}`, geocoder))
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
      onMapLoaded(markers, Map);
    };
    setMap().catch((err) => console.error(err));
  }, [placeNames, Map]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? renderMap() : <Spinner />;
};

export default Map;
