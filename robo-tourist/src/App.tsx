import { useState } from "react";
import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import { MarkerProps } from "./features/map/interfaces";
import List from "./features/list/List";

function App() {
  const [places, setPlaces] = useState<string[]>(["london bridge"]);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [MapsApi, setMapsApi] = useState();

  const handleMapLoaded = (places: MarkerProps[], MapsApi: any) => {
    setMarkers(places);
    setMapsApi(MapsApi);
  };

  return (
    <div className="App">
      <main>
        <PromptForm
          onNewSuggestions={(suggestions) => setPlaces(suggestions)}
        />
        <div className="container">
          <List places={markers} map={MapsApi} />

          <div className="map-section">
            <Map placeNames={places} onMapLoaded={handleMapLoaded} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
