import { useState } from "react";
import { Provider, useSelector } from "react-redux";

import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import List from "./features/list/List";
import { AppMode } from "./globals/interfaces";
import Spinner from "./components/Spinner";
import { getSuggestions } from "./features/suggestions/openai-wrapper";
import Navbar from "./features/list/Navbar";
import { selectPrompt } from "./store/promptSlice";
import { promptActions } from "./store/promptSlice";
import { store } from "./store/store";

function App() {
  const [mode, setMode] = useState<AppMode>("Prompt");
  const [places, setPlaces] = useState<string[]>(["london bridge"]);
  const [showDirections, setShowDirections] = useState(true);
  const [MapRef, setMapRef] = useState();
  const [selected, setSelected] = useState<number | null>(null);

  const promptInfo = useSelector(selectPrompt);

  const handleFormSubmitted = (prompt) => {
    setMode("Loading");
    getSuggestions(prompt.target, prompt.preference).then((suggestions) => {
      if (suggestions) {
        setPlaces(suggestions);
        setMode("Result");
      } else setMode("Prompt");
    });
  };
  const handleMapLoaded = (MapsApi: any) => {
    setMapRef(MapsApi);
    setMode("Result");
  };

  const handleMarkerSelect = (index: number, selected: boolean) => {
    setSelected(selected ? index : null);
  };

  return (
    <div className="App">
      <main>
        {mode === "Prompt" && <PromptForm onFormSubmit={handleFormSubmitted} />}
        {mode === "Loading" && (
          <Spinner message="Beep boop\nThe robot is gathering suggestions..." />
        )}
        {mode === "Result" && (
          <div className="container">
            <Navbar
              travelMode={promptInfo.travelMode}
              showDirections={showDirections}
              onNewSearch={() => setMode("Prompt")}
              onChangeTravelMode={(travelMode) =>
                promptActions.updateTravelMode(travelMode)
              }
              onChangeShowDirections={(show) => setShowDirections(show)}
            />
            <List
              map={MapRef}
              onMarkerSelect={(index) => handleMarkerSelect(index, true)}
              onMarkerDeselect={(index) => handleMarkerSelect(index, false)}
            />

            <div className="map-section">
              <Map
                placeNames={places}
                showDirections={showDirections}
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
