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
import OverlaySpinner from "./components/OverlaySpinner";
import { QueryClient, QueryClientProvider } from "react-query";
import StoredPlansList from "./features/persistance/StoredPlansList";

function App() {
  const [places, setPlaces] = useState<string[]>([]);
  const [MapRef, setMapRef] = useState();

  const dispatch = getDispatch();
  const appState = useSelector(selectAppState);

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    if (
      (appState.mode === "Prompt" || appState.mode === "Result") &&
      abortController?.signal
    ) {
      abortController.abort();
    }
  }, [appState.mode]);

  const handleFormSubmitted = (prompt) => {
    const controller = new AbortController();
    setAbortController(controller);
    setPlaces([]);
    dispatch(appActions.setMode("Loading"));

    try {
      getSuggestions(
        prompt.target,
        prompt.preference ?? null,
        prompt.origin ?? null,
        (place) => {
          setPlaces((curr) => [...curr, place]);
          dispatch(appActions.setMode("LoadingProgressive"));
        },
        () => {
          dispatch(appActions.setMode("Result"));
        },
        controller.signal
      );
    } catch (error) {
      dispatch(appActions.setMode("Error"));
      dispatch(appActions.setError(error.message));
    }
  };
  const handleMapLoaded = (MapsApi: any) => {};
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
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
            {appState.mode === "LoadingProgressive" && (
              <OverlaySpinner>
                <div className="container">
                  <List map={MapRef} />
                  <div className="map-section">
                    <Map placeNames={places} onMapLoaded={handleMapLoaded} />
                  </div>
                </div>
              </OverlaySpinner>
            )}

            {appState.mode === "Result" && (
              <div className="container">
                <List map={MapRef} />
                <div className="map-section">
                  <Map placeNames={places} onMapLoaded={handleMapLoaded} />
                </div>
              </div>
            )}
            {appState.mode === "Storage" && (
              <div className="container">
                <StoredPlansList />
              </div>
            )}
            {appState.mode === "Error" && <Error />}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
