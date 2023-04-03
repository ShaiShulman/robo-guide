import { useState } from "react";
import { useSelector } from "react-redux";

import Map from "./features/map/Map";
import "./App.css";
import PromptForm from "./features/prompt/PromptForm";
import List from "./features/list/List";
import Spinner from "./components/Spinner";
import { getSuggestions } from "./features/suggestions/openai-wrapper";
import Navigation from "./components/Navigation";
import Error from "./components/Error";
import getDispatch from "./lib/get-dispatch";
import { appActions, selectAppState } from "./store/appSlice";

function App() {
  const [places, setPlaces] = useState<string[]>([]);
  const [MapRef, setMapRef] = useState();

  const dispatch = getDispatch();
  const appState = useSelector(selectAppState);

  const handleFormSubmitted = (prompt) => {
    dispatch(appActions.setMode("Loading"));
    getSuggestions(prompt.target, prompt.preference)
      .then((suggestions) => {
        if (suggestions) {
          setPlaces(suggestions);
          dispatch(appActions.setMode("Result"));
        } else appActions.setMode("Prompt");
      })
      .catch((error) => {
        dispatch(appActions.setError(error.message));
      });
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
          {appState.mode === "Prompt" && (
            <div className="container">
              <PromptForm onFormSubmit={handleFormSubmitted} />
            </div>
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
        </main>
      </div>
    </>
  );
}

export default App;
