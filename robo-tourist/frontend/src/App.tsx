import { useState } from "react";
import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import { MarkerProps, TravelMode } from "./features/map/interfaces";
import List from "./features/list/List";

function App() {
  const [places, setPlaces] = useState<string[]>(["london bridge"]);
  const [target, setTarget] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [travelMode, setTravelMode] = useState<TravelMode>();
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [MapRef, setMapRef] = useState();
  const [inputMode, setInputMode] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  const handleMapLoaded = (places: MarkerProps[], MapsApi: any) => {
    setMarkers(places);
    setMapRef(MapsApi);
  };

  const handleMarkerSelect = (placeId: number, selected: boolean) => {
    setSelected(selected ? placeId : null);
  };

  return (
    <div className="App">
      <main>
        {inputMode && (
          <PromptForm
            onNewSuggestions={(suggestions, target, origin, transportMode) => {
              setPlaces(suggestions),
                setTarget(target),
                setOrigin(origin),
                setTravelMode(travelMode);
              setInputMode(false);
            }}
          />
        )}
        {!inputMode && (
          <div className="container">
            <List
              places={markers}
              map={MapRef}
              onMarkerSelect={(id) => handleMarkerSelect(id, true)}
              onMarkerDeselect={(id) => handleMarkerSelect(id, false)}
            />

            <div className="map-section">
              <Map
                placeNames={places}
                targetName={target}
                originName={origin}
                travelMode={travelMode}
                onMapLoaded={handleMapLoaded}
                selected={selected}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
