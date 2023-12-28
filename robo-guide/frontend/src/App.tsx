import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import List from "./features/list/List";
import Spinner from "./components/Spinner";
import Navigation from "./components/Navigation";
import Error from "./components/Error";
import getDispatch from "./lib/get-dispatch";
import { appActions, selectAppState } from "./store/appSlice";
import { getSuggestions } from "./api-services/suggestions";

function App() {
  const [places, setPlaces] = useState<string[]>([]);
  const [MapRef, setMapRef] = useState();

  const dispatch = getDispatch();
  const appState = useSelector(selectAppState);

  let abortController: AbortController = null;

  useEffect(() => {
    if (appState.mode === "Prompt" && abortController.signal)
      abortController.abort();
  }, [appState.mode]);

  const handleFormSubmitted = (prompt) => {
    abortController = new AbortController();
    setPlaces([]);
    dispatch(appActions.setMode("Result"));
    getSuggestions(
      prompt.target,
      prompt.preference,
      (place) => setPlaces((curr) => [...curr, place]),
      abortController.signal
    );
  };
  const handleMapLoaded = (MapsApi: any) => {
    setMapRef(MapsApi);
    dispatch(appActions.setMode("Result"));
  };

  return (
    <>
      <Navigation />
      <div id="App">
        <main>
          <div className="container">
            {appState.mode === "Prompt" && (
              <PromptForm onFormSubmit={handleFormSubmitted} />
            )}
            {appState.mode === "Loading" && (
              <Spinner message="Beep boop\nThe robot is gathering suggestions..." />
            )}
            {appState.mode === "Result" && (
              <div className="container">
                <List map={MapRef} />

                <div className="map-section">
                  <Map placeNames={places} onMapLoaded={handleMapLoaded} />
                </div>
              </div>
            )}
            {appState.mode === "Error" && <Error />}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
