import { useEffect, useMemo, useRef, useState } from "react";

import { GOOGLE_MAPS_API_KEY } from "../features/map/const";
import { useJsApiLoader } from "@react-google-maps/api";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

const LIBRARIES = ["places"] as any;
const SEARCH_RADIUS = 200000;

interface PlaceSelectControlProps {
  id: string;
  value: string;
  required?: boolean;
  minLength: number;
  maxLength: number;
  placeholder: string;
  restrictSearchRegions?: boolean;
  restrictSearchLocation?: string;
  onUpdate: (newValue: string) => void;
}

export const PlaceSelectControl: React.FC<PlaceSelectControlProps> = (
  props
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({ items: [], status: "" });
  const [value, setValue] = useState(props.value);
  const [targetLatLng, setTargetLatLng] = useState<google.maps.LatLng>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const handleUpdate = () => {
    props.onUpdate(value);
    console.log(value);
  };

  const service = useMemo(
    () =>
      isLoaded ? new window.google.maps.places.AutocompleteService() : null,
    [isLoaded]
  );

  const geocodingService = useMemo(
    () =>
      isLoaded && props.restrictSearchLocation
        ? new google.maps.Geocoder()
        : undefined,
    [isLoaded, props.restrictSearchLocation]
  );

  const sessionToken = useMemo(
    () =>
      isLoaded
        ? new window.google.maps.places.AutocompleteSessionToken()
        : null,
    [isLoaded]
  );

  const inputRef = useRef();

  useEffect(() => {
    if (props.restrictSearchLocation)
      getTargetLocation(props.restrictSearchLocation, (latLng) => {
        setTargetLatLng(latLng);
      });
  }, [props.restrictSearchLocation]);

  function getTargetLocation(
    name: string,
    callback: (latLng: google.maps.LatLng | null) => void
  ): void {
    // Use the Google Maps JavaScript API to get the Geocoder
    const geocoder = new google.maps.Geocoder();

    // Use the Geocoder to convert the location name to a latitude and longitude
    geocoder.geocode({ address: name }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const latLng = new google.maps.LatLng(location.lat(), location.lng());
        callback(latLng);
      } else {
        console.error(`Geocode request failed with status ${status}`);
        callback(null);
      }
    });
  }

  const getPredictions = (query: string) => {
    setIsLoading(true);
    service.getPlacePredictions(
      {
        input: query,
        types: props.restrictSearchRegions
          ? ["country", "locality", "sublocality", "neighborhood"]
          : undefined,
        location: props.restrictSearchLocation ? targetLatLng : undefined,
        radius: props.restrictSearchLocation ? SEARCH_RADIUS : undefined,

        sessionToken: sessionToken,
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const predictionsFormatted = predictions.map((prediction) => ({
            label: prediction.description,
            address: prediction.structured_formatting.secondary_text,
          }));
          setSearchResults({ items: predictionsFormatted, status: status });
        } else setSearchResults({ items: [], status: status });
        setValue(query);
        setIsLoading(false);
        console.log(query);
      }
    );
  };

  return (
    <>
      <AsyncTypeahead
        id={props.id}
        isLoading={isLoading}
        ref={inputRef}
        filterBy={() => true}
        labelKey="label"
        inputProps={{
          required: props.required,
          minLength: props.minLength,
          maxLength: props.maxLength,
          placeholder: props.placeholder,
        }}
        placeholder={props.placeholder}
        minLength={3}
        defaultInputValue={props.value}
        options={searchResults.items}
        renderMenuItemChildren={(option: any, { text }) => (
          <>
            <Highlighter search={text}>{option.label}</Highlighter>
            <div>
              <small className="text-muted">{option.address}</small>
            </div>
          </>
        )}
        onSearch={getPredictions}
        onChange={(selected: any) => {
          if (selected[0] && selected[0].label) {
            setValue(selected[0].label);
            console.log(selected[0].label);
          }
        }}
        onInputChange={(input) => {
          // setValue(input);
          console.log(value);
        }}
        onBlur={handleUpdate}
      />
    </>
  );
};

export default PlaceSelectControl;
