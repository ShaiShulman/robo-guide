import { useEffect, useRef, useState } from "react";
import { getBounds, getDistances, getPlace, splitPlaceName } from "./map-utils";
import { Coord, MarkerProps, Place, TravelMode } from "./interfaces";
import { Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "./const";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React from "react";
import { Spinner } from "react-bootstrap";
import bullseyeIcon from "../../assets/bullseye.svg";

interface MapProps {
  placeNames: string[];
  targetName: string;
  originName?: string;
  travelMode?: TravelMode;
  showDirections: boolean;
  onMapLoaded: (places: MarkerProps[], Map: any) => void;
  selected?: number | null;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({
  placeNames,
  targetName,
  originName,
  travelMode,
  showDirections,
  onMapLoaded,
  selected,
}) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [originCoord, setOriginCoord] = useState<Coord>();
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
        {originCoord && (
          <Marker key="center" position={originCoord} icon={bullseyeIcon} />
        )}
        {showDirections && selected && (
          <DirectionsRenderer
            directions={markers[selected].route}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    );
  };

  useEffect(() => {
    if (placeNames.length === 0 || !Map) return;
    const setMap = async () => {
      const geocoder = new google.maps.Geocoder();
      let origin: Place | null = null;
      let newMarkers: MarkerProps[] | null = null;
      if (markers.length === 0) {
        const locations = (await Promise.allSettled(
          placeNames.map((place) =>
            getPlace(splitPlaceName(place)[0], targetName, geocoder)
          )
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

        newMarkers = placeNames
          .map((place, index) => ({
            title: splitPlaceName(place)[0],
            desc: splitPlaceName(place)[1],
            lat: locations[index]?.value?.lat,
            lng: locations[index]?.value?.lng,
            placeId: locations[index]?.value?.id,
            route: null,
          }))
          .filter((place) => place.lat && place.lng);
        const bounds = getBounds(geometry);
        setMapBounds(bounds);
        Map.fitBounds(bounds);
        setMarkers(newMarkers);
        origin = await getPlace(originName || targetName, targetName, geocoder);
        if (originName && origin)
          setOriginCoord({ lat: origin.lat, lng: origin.lng });
      } else newMarkers = [...markers];
      console.log(originCoord, origin);
      const routes = await getDistances(
        { lat: (originCoord || origin).lat, lng: (originCoord || origin).lng },
        newMarkers.map((m) => ({ lat: m.lat, lng: m.lng })),
        travelMode
      );
      routes.forEach((route, index) => {
        newMarkers[index].route = route;
      });
      setMarkers(newMarkers);

      onMapLoaded(newMarkers, Map);
    };
    setMap().catch((err) => console.error(err));
  }, [placeNames, targetName, travelMode, Map]);

  useEffect(() => {
    if (!Map) return;
    if (!isNaN(lastSelected)) {
      const marker = markerRefs.current[lastSelected];
      if (marker) marker.setAnimation(null);
    }
    if (!isNaN(selected)) {
      const marker = markerRefs.current[selected];
      if (marker) marker.setAnimation(google.maps.Animation.BOUNCE);
      setLastSelected(selected);
    } else {
      if (mapBounds) Map.fitBounds(mapBounds);
    }
  }, [Map, selected, markerRefs]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? renderMap() : <Spinner />;
};

export default Map;
