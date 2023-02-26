import { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import { MarkerProps } from "./features/map/interfaces";
import List from "./features/list/List";
import { GOOGLE_MAPS_API_KEY } from "./features/map/const";
function App() {
  const [places, setPlaces] = useState<string[]>(["london bridge"]);
  const [target, setTarget] = useState<string>();
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [MapRef, setMapRef] = useState();
  const [inputMode, setInputMode] = useState(true);

  const handleMapLoaded = (places: MarkerProps[], MapsApi: any) => {
    setMarkers(places);
    setMapRef(MapsApi);
  };

  return (
    <div className="App">
      <main>
        <PromptForm
          onNewSuggestions={(suggestions, target) => {
            setPlaces(suggestions), setTarget(target);
          }}
        />
        <div className="container">
          <List places={markers} map={MapRef} />

          <div className="map-section">
            <Map
              placeNames={places}
              targetName={target}
              onMapLoaded={handleMapLoaded}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
