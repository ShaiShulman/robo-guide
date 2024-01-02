import { ComponentRef, useEffect, useRef, useState } from "react";
import {
  getBounds,
  getPlace,
  numberedMarker,
  splitPlaceName,
} from "./map-utils";
import { Coord, MarkerInfo } from "../../data/interfaces";
import { Directions, MarkerWithDirections, Place } from "./interfaces";
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
import getDispatch from "../../lib/get-dispatch";
import { selectView, viewActions } from "../../store/viewSlice";
import { updateDirections } from "./directions-utils";
import { updateMarkerDetailsPhotoSingle } from "./photos-middleware";
import { appActions, selectAppState } from "../../store/appSlice";

interface MapProps {
  placeNames: string[];
  onMapLoaded: (Map: any) => void;
}

const LIBRARIES = ["places"] as any;

const Map: React.FC<MapProps> = ({ placeNames, onMapLoaded }) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [originCoord, setOriginCoord] = useState<Coord | null>();
  const [Map, setMap] = useState(null);
  const [directions, setDirections] = useState<Directions>({});

  const windowWidth = useRef(window.innerWidth);
  const markerRefs = useRef([]);

  const view = useSelector(selectView);
  const appState = useSelector(selectAppState);

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

  const getOrigin = async (geocoder) => {
    if (originCoord || !promptInfo.origin) return;
    const newOriginCoord = await getPlace(
      promptInfo.origin || promptInfo.target,
      promptInfo.target,
      geocoder
    );
    if (newOriginCoord) {
      setOriginCoord({ lat: newOriginCoord.lat, lng: newOriginCoord.lng });
      return { lat: newOriginCoord.lat, lng: newOriginCoord.lng } as Coord;
    } else return null;
  };

  const getDirections = async (
    markers: MarkerWithDirections[],
    origin: Coord,
    startIndex: number
  ) => {
    if (!origin) return;
    const newDirections = await updateDirections(
      markers,
      directions,
      promptInfo.travelMode,
      origin,
      startIndex
    );
    for (const marker of markers) {
      marker.routeDistance =
        newDirections[markers.indexOf(marker) + startIndex][
          promptInfo.travelMode
        ]?.routes[0]?.legs[0].distance.value;
      marker.routeDuration =
        newDirections[markers.indexOf(marker) + startIndex][
          promptInfo.travelMode
        ]?.routes[0]?.legs[0].duration.value;
    }
    markers.forEach((marker, idx) => {
      dispatch(
        markersActions.update({
          index: startIndex + idx,
          marker: {
            routeDuration: marker.routeDuration,
            routeDistance: marker.routeDistance,
          },
        })
      );
    });

    return newDirections;
  };

  const renderMap = () => {
    const onLoad = (map: any) => {
      setMap(map);
    };

    const sortedMarkers = Array.from(markers).sort(
      (a, b) => (a.routeDuration ?? 0) - (b.routeDuration ?? 0)
    );

    return (
      <GoogleMap
        mapContainerStyle={{
          height: "300px",
          width: Math.min(windowWidth.current, 1140),
        }}
        onLoad={onLoad}
        zoom={5}
      >
        {markers
          .map((marker) => ({
            ...marker,
            index: sortedMarkers.findIndex((m) => m === marker),
          }))
          .map((marker, idx) => {
            return (
              <Marker
                key={idx}
                icon={numberedMarker(marker.index + 1)}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
                onClick={() => handleMarkerClick(idx)}
                onLoad={(marker) => markerRefs.current.push(marker)}
              />
            );
          })}
        {originCoord && (
          <Marker key="center" position={originCoord} icon={bullseyeIcon} />
        )}
        {view.directions &&
          view.selected !== null &&
          markers[view.selected].routeDistance > 0 &&
          directions[view.selected] &&
          directions[view.selected][promptInfo.travelMode] && (
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
    const currMarkersCount = markers.length;
    const setMap = async () => {
      const geocoder = new google.maps.Geocoder();
      const origin = await getOrigin(geocoder);
      let newMarkers: MarkerWithDirections[] | null = null;
      const newPlaceNames = placeNames.filter(
        (place) =>
          !markers.find((marker) => marker.title === splitPlaceName(place)[0])
      );
      const locations = (await Promise.allSettled(
        newPlaceNames.map((place) =>
          getPlace(splitPlaceName(place)[0], promptInfo.target, geocoder)
        )
      )) as any[];
      const geometry = locations
        .filter((loc: any) => loc.status === "fulfilled")
        .map((loc: any) => ({
          lat: loc.value.lat,
          lng: loc.value.lng,
        }))
        .concat(
          markers.map((marker) => ({ lat: marker.lat, lng: marker.lng }))
        );
      newMarkers = newPlaceNames
        .map((place, index) => ({
          title: splitPlaceName(place)[0],
          desc: splitPlaceName(place)[1],
          lat: locations[index]?.value?.lat,
          lng: locations[index]?.value?.lng,
          placeId: locations[index]?.value?.id,
          directions: null,
        }))
        .filter((place) => place.lat && place.lng);
      const bounds = getBounds(geometry);
      setMapBounds(bounds);
      Map.fitBounds(bounds);
      newMarkers.forEach((marker) => {
        dispatch(markersActions.add({ ...marker }));
      });
      if (newMarkers.length) {
        const newDirections = await getDirections(
          newMarkers,
          origin || originCoord,
          currMarkersCount
        );
        setDirections(newDirections);
        newMarkers.forEach((marker, idx) => {
          dispatch(
            updateMarkerDetailsPhotoSingle(Map, marker, currMarkersCount + idx)
          );
        });
      }
      onMapLoaded(Map);
    };
    setMap();
    // .then((result) => {
    //   if (!isMarkersLoaded) dispatch(updateMarkerDetailsPhotos(Map));
    // })
    // .catch((err) => console.error(err));
  }, [placeNames, promptInfo.target, Map]);

  useEffect(() => {
    const update = async () => {
      if (!Map || !markers || appState.mode !== "Result") return;
      // setDirections(
      //   await getDirections(
      //     markers.map(
      //       (marker) =>
      //         ({ ...marker, directions: null } as MarkerWithDirections)
      //     ),
      //     originCoord,
      //     0
      //   )
      // );
    };
    update();
  }, [promptInfo.travelMode, appState.mode]);

  useEffect(() => {
    if (!Map) return;
    markerRefs.current.forEach((mrk, idx) => {
      mrk.setAnimation(
        idx === view.selected ? google.maps.Animation.BOUNCE : null
      );
      if (idx === view.selected) {
        Map.panTo(mrk.getPosition());
      }
    });
    if (view.selected === null && mapBounds) Map.fitBounds(mapBounds);
  }, [Map, view.selected, markerRefs]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? renderMap() : <Spinner />;
};

export default Map;
