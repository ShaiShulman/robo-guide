import { useEffect, useRef, useState } from "react";
import {
  getBounds,
  getDistances,
  getPhoto,
  getPlace,
  numberedMarker,
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
import {
  markersActions,
  selectMarkers,
  updateMarkerPhotos,
} from "../../store/markerSlice";
import getDispatch from "../../lib/get-dispatch";
import { selectView, viewActions } from "../../store/viewSlice";

interface MapProps {
  placeNames: string[];
  onMapLoaded: (Map: any) => void;
}

interface MarkerWithRoute extends MarkerInfo {
  route?: google.maps.DirectionsResult;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({ placeNames, onMapLoaded }) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [originCoord, setOriginCoord] = useState<Coord>();
  const [Map, setMap] = useState(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsResult[]>([]);

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

  const getPhotos = async (placeIds: string[]) => {
    const urls = (await Promise.allSettled(
      placeIds.map((id) => getPhoto(id, Map))
    )) as any[];
    return urls.map((url) => url.value);
  };

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
            directions={routes[view.selected]}
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
      let newMarkers: MarkerWithRoute[] | null = null;
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
      } else newMarkers = [...markers];
      const newRoutes = await getDistances(
        { lat: (originCoord || origin).lat, lng: (originCoord || origin).lng },
        newMarkers.map((m) => ({ lat: m.lat, lng: m.lng })),
        promptInfo.travelMode
      );
      newRoutes.forEach((route, index) => {
        newMarkers[index].routeDistance =
          route.routes[0]?.legs[0].distance.value;
        newMarkers[index].routeDuration =
          route.routes[0]?.legs[0].duration.value;
        newMarkers[index].route = route;
      });
      newMarkers.sort((a, b) =>
        a.routeDuration ? a.routeDuration - (b.routeDuration ?? 0) : -1
      );
      setRoutes(newMarkers.map((marker) => marker.route));
      dispatch(
        markersActions.update(
          newMarkers.map(({ route, ...rest }) => {
            return rest;
          })
        )
      );
      onMapLoaded(Map);
      const photos = await getPhotos(
        newMarkers.map((marker) => marker.placeId)
      );
      dispatch(markersActions.updatePhotos(photos));
    };
    setMap()
      .then((result) => dispatch(updateMarkerPhotos()))
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
