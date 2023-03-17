import { useState } from "react";
import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import { MarkerProps, TravelMode } from "./features/map/interfaces";
import List from "./features/list/List";
import { AppMode } from "./global/interfaces";
import Spinner from "./global/components/Spinner";
import { getSuggestions } from "./features/suggestions/openai-wrapper";
import Navbar from "./features/list/Navbar";

function App() {
  const [mode, setMode] = useState<AppMode>("Prompt");
  const [places, setPlaces] = useState<string[]>(["london bridge"]);
  const [target, setTarget] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [travelMode, setTravelMode] = useState<TravelMode>();
  const [showDirections, setShowDirections] = useState(true);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [MapRef, setMapRef] = useState();
  const [selected, setSelected] = useState<number | null>(null);

  const handleFormSubmitted = (
    prompt: string,
    preference: string,
    origin: string,
    travelMode: TravelMode
  ) => {
    setMode("Loading");
    getSuggestions(prompt, preference).then((suggestions) => {
      if (suggestions) {
        console.log(suggestions);
        setPlaces(suggestions);
        setTarget(prompt);
        setOrigin(origin);
        setTravelMode(travelMode);
        setMode("Result");
      } else setMode("Prompt");
    });
  };
  const handleMapLoaded = (places: MarkerProps[], MapsApi: any) => {
    setMarkers(places);
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
          <Spinner message="Beep boop\nThe robot is creating a gathering suggestions..." />
        )}
        {mode === "Result" && (
          <div className="container">
            <Navbar
              travelMode={travelMode}
              showDirections={showDirections}
              onNewSearch={() => setMode("Prompt")}
              onChangeTravelMode={(travelMode) => setTravelMode(travelMode)}
              onChangeShowDirections={(show) => setShowDirections(show)}
            />
            <List
              places={markers}
              map={MapRef}
              travelMode={travelMode}
              onMarkerSelect={(index) => handleMarkerSelect(index, true)}
              onMarkerDeselect={(index) => handleMarkerSelect(index, false)}
            />

            <div className="map-section">
              <Map
                placeNames={places}
                targetName={target}
                originName={origin}
                travelMode={travelMode}
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
