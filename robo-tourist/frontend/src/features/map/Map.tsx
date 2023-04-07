import { useEffect, useRef, useState } from "react";
import {
  getBounds,
  getPlace,
  numberedMarker,
  splitPlaceName,
} from "./map-utils";
import { Coord } from "../../globals/interfaces";
import { Directions, MarkerWithDirections, Place } from "./interfaces";
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
import {
  markersActions,
  selectMarkers,
  updateMarkerPhotos,
} from "../../store/markerSlice";
import getDispatch from "../../lib/get-dispatch";
import { selectView, viewActions } from "../../store/viewSlice";
import { updateDirections } from "./directions-utils";

interface MapProps {
  placeNames: string[];
  onMapLoaded: (Map: any) => void;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({ placeNames, onMapLoaded }) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [originCoord, setOriginCoord] = useState<Coord>();
  const [Map, setMap] = useState(null);
  const [directions, setDirections] = useState<Directions>({});

  const windowWidth = useRef(window.innerWidth);
  const markerRefs = useRef([]);

  const view = useSelector(selectView);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const promptInfo = useSelector(selectPrompt);
  const markers = useSelector(selectMarkers);
  const dispatch = getDispatch();

  const handleMarkerClick = (index: number) => {
    dispatch(viewActions.setSelected(view.selected === index ? null : index));
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
              icon={numberedMarker(index + 1)}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
              onClick={() => handleMarkerClick(index)}
              onLoad={(marker) => markerRefs.current.push(marker)}
            />
          );
        })}
        {originCoord && (
          <Marker key="center" position={originCoord} icon={bullseyeIcon} />
        )}
        {view.directions && view.selected !== null && (
          <DirectionsRenderer
            directions={directions[view.selected][promptInfo.travelMode]}
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
      let newMarkers: MarkerWithDirections[] | null = null;
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
          }))
          .filter((place) => place.lat && place.lng);
        const bounds = getBounds(geometry);
        setMapBounds(bounds);
        Map.fitBounds(bounds);
        origin = await getPlace(
          promptInfo.origin || promptInfo.target,
          promptInfo.target,
          geocoder
        );
        if (promptInfo.origin && origin)
          setOriginCoord({ lat: origin.lat, lng: origin.lng });
      } else newMarkers = structuredClone(markers);
      const newDirections = await updateDirections(
        newMarkers,
        directions,
        promptInfo.travelMode,
        { lat: (originCoord || origin).lat, lng: (originCoord || origin).lng }
      );
      for (const marker of newMarkers) {
        (newMarkers[newMarkers.indexOf(marker)].routeDistance as number) =
          newDirections[newMarkers.indexOf(marker)][
            promptInfo.travelMode
          ]?.routes[0]?.legs[0].distance.value;
        newMarkers[newMarkers.indexOf(marker)].routeDuration =
          newDirections[newMarkers.indexOf(marker)][
            promptInfo.travelMode
          ]?.routes[0]?.legs[0].duration.value;
        newMarkers[newMarkers.indexOf(marker)].directions =
          newDirections[newMarkers.indexOf(marker)];
      }
      newMarkers.sort((a, b) =>
        a.routeDuration ? a.routeDuration - (b.routeDuration ?? 0) : -1
      );
      setDirections(newMarkers.map((marker) => marker.directions));
      dispatch(
        markersActions.update(
          newMarkers.map(({ directions: route, ...rest }) => {
            return rest;
          })
        )
      );
      onMapLoaded(Map);
      dispatch(updateMarkerPhotos);
    };
    setMap()
      .then((result) => dispatch(updateMarkerPhotos(Map)))
      .catch((err) => console.error(err));
  }, [placeNames, promptInfo.target, promptInfo.travelMode, Map]);

  useEffect(() => {
    if (!Map) return;
    markerRefs.current.forEach((mrk, idx) => {
      mrk.setAnimation(
        idx === view.selected ? google.maps.Animation.BOUNCE : null
      );
    });
    if (view.selected === null && mapBounds) Map.fitBounds(mapBounds);
  }, [Map, view.selected, markerRefs]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? renderMap() : <Spinner />;
};

export default Map;
