import { useEffect, useRef, useState } from "react";
import {
  getBounds,
  getDistances,
  getPhoto,
  getPlace,
  splitPlaceName,
} from "./map-utils";
import { Coord } from "../../globals/interfaces";
import { Place } from "./interfaces";
import { MarkerInfo } from "../../globals/interfaces";
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
import { useSelector } from "react-redux";
import { selectPrompt } from "../../store/promptSlice";
import { markersActions, selectMarkers } from "../../store/markerSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

interface MapProps {
  placeNames: string[];
  showDirections: boolean;
  onMapLoaded: (Map: any) => void;
  selected?: number | null;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({
  placeNames,
  showDirections,
  onMapLoaded,
  selected,
}) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [originCoord, setOriginCoord] = useState<Coord>();
  const [Map, setMap] = useState(null);
  const [lastSelected, setLastSelected] = useState<number | null>(null);

  const windowWidth = useRef(window.innerWidth);
  const markerRefs = useRef([]);

  const dispatch: AppDispatch = useDispatch();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const promptInfo = useSelector(selectPrompt);
  const markers = useSelector(selectMarkers);

  const getPhotos = async (places) => {
    const urls = (await Promise.allSettled(
      places.map((place) => getPhoto(place.placeId, Map))
    )) as any[];
    const newMarkers = places.map((place, index) => ({
      ...place,
      imageUrl: urls[index].value,
    }));
    console.log(newMarkers);
    dispatch(markersActions.create(newMarkers));
  };

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
    if (placeNames.length === 0 || !Map || markers.length) return;
    const setMap = async () => {
      const geocoder = new google.maps.Geocoder();
      let origin: Place | null = null;
      let newMarkers: MarkerInfo[] | null = null;
      if (markers.length === 0) {
        const locations = (await Promise.allSettled(
          placeNames.map((place) =>
            getPlace(splitPlaceName(place)[0], promptInfo.target, geocoder)
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
        // dispatch(markersActions.create(markers));
        origin = await getPlace(
          promptInfo.origin || promptInfo.target,
          promptInfo.target,
          geocoder
        );
        if (promptInfo.origin && origin)
          setOriginCoord({ lat: origin.lat, lng: origin.lng });
      } else newMarkers = [...markers];
      const routes = await getDistances(
        { lat: (originCoord || origin).lat, lng: (originCoord || origin).lng },
        newMarkers.map((m) => ({ lat: m.lat, lng: m.lng })),
        promptInfo.travelMode
      );
      // routes.forEach((route, index) => {
      //   newMarkers[index].route = route;
      // });
      dispatch(markersActions.create(newMarkers));
      onMapLoaded(Map);
    };
    setMap().catch((err) => console.error(err));
  }, [placeNames, promptInfo.target, promptInfo.travelMode, Map]);

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
