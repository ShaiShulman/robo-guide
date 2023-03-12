import { useEffect, useRef, useState } from "react";
import { getBounds, getDistances, getPlace, splitPlaceName } from "./utils";
import { Coord, MarkerProps, TravelMode } from "./interfaces";
import { Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "./const";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React from "react";
import { Spinner } from "react-bootstrap";

interface MapProps {
  placeNames: string[];
  targetName: string;
  originName?: string;
  travelMode?: TravelMode;
  onMapLoaded: (places: MarkerProps[], Map: any) => void;
  selected?: number | null;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({
  placeNames,
  targetName,
  originName,
  travelMode,
  onMapLoaded,
  selected,
}) => {
  const [center, setCenter] = useState<Coord>({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [Map, setMap] = useState(null);
  const [lastSelected, setLastSelected] = useState<number | null>(null);

  const windowWidth = useRef(window.innerWidth);
  const markerRefs = useRef([]);

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
          width: Math.min(windowWidth.current, 1140),
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
              title={marker.title}
              onLoad={(marker) => markerRefs.current.push(marker)}
            />
          );
        })}
        {selected && (
          <DirectionsRenderer directions={markers[selected].route} />
        )}
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
          title: splitPlaceName(place)[0],
          desc: splitPlaceName(place)[1],
          lat: locations[index]?.value?.lat,
          lng: locations[index]?.value?.lng,
          placeId: locations[index]?.value?.id,
          route: null,
        }))
        .filter((place) => place.lat && place.lng);
      Map.fitBounds(getBounds(geometry));
      const origin = await getPlace(originName || targetName, geocoder);
      const routes = await getDistances(
        { lat: origin.lat, lng: origin.lng },
        markers.map((m) => ({ lat: m.lat, lng: m.lng })),
        travelMode
      );
      console.log(routes);
      routes.forEach((route, index) => {
        markers[index].route = route;
      });
      setMarkers(markers);

      onMapLoaded(markers, Map);
    };
    setMap().catch((err) => console.error(err));
  }, [placeNames, Map]);

  useEffect(() => {
    if (!Map) return;
    if (lastSelected) {
      const marker = markerRefs.current[lastSelected];
      if (marker) marker.setAnimation(null);
    }
    if (selected) {
      const marker = markerRefs.current[selected];
      if (marker) marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    setLastSelected(selected);
  }, [Map, selected, markerRefs]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? renderMap() : <Spinner />;
};

export default Map;
