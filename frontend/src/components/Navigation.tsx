import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import getDispatch from "../lib/get-dispatch";
import { resetAppState, selectAppState, appActions } from "../store/appSlice";
import { promptActions, selectPrompt } from "../store/promptSlice";
import { selectView, viewActions } from "../store/viewSlice";
import brandLogo from "../assets/brand-logo.png";
import { TravelModeType, TravelMode } from "../data/interfaces";
import "./Navigation.css";
import React, { useEffect } from "react";
import {
  useLoadPlanNames,
  useSavePlan,
} from "../features/persistance/plan-storage";
import {
  markersActions,
  selectIsSaved,
  selectMarkers,
} from "../store/markerSlice";

const Navigation: React.FC = ({}) => {
  const dispatch = getDispatch();
  const appState = useSelector(selectAppState);
  const markers = useSelector(selectMarkers);
  const isSaved = useSelector(selectIsSaved);
  const view = useSelector(selectView);
  const prompt = useSelector(selectPrompt);

  const savePlanMutation = useSavePlan();
  const { data: planNames, isLoading, isError } = useLoadPlanNames();

  useEffect(() => {
    console.log("planNames", planNames);
    console.log("isLoading", isLoading);
    console.log("isError", isError);
  }, [planNames, isLoading, isError]);

  const newSearch = (e: any) => {
    dispatch(resetAppState());
    e.preventDefault();
  };

  const cancelSearch = (e: any) => {
    dispatch(appActions.setMode("Result"));
    // e.preventDefault();
  };

  const goToStorage = (e: any) => {
    dispatch(appActions.setMode("Storage"));
    // e.preventDefault();
  };

  const toggleDirections = (e: any) => {
    dispatch(viewActions.toggleDirections());
    e.preventDefault();
  };

  const toggleCompact = (e: any) => {
    dispatch(viewActions.toggleCompact());
    e.preventDefault();
  };

  const saveResults = (e: any) => {
    savePlanMutation.mutate({
      target: prompt.target,
      originName: prompt.origin,
      preference: prompt.preference,
      markers,
    });
    dispatch(markersActions.setSaved());
    e.preventDefault();
  };

  const setTravelMode = (value: TravelModeType) => {
    dispatch(promptActions.updateTravelMode(value));
  };

  return (
    <div className="navbar-container">
      <Navbar expand="lg" bg="dark" variant="dark">
        <img className="navbar-brand-image" src={brandLogo} alt="logo" />
        <Navbar.Brand href="#">RoboGuide</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse key="collapse">
          <Nav>
            {(appState.mode === "Prompt" ||
              appState.mode === "Result" ||
              appState.mode === "Storage") && (
              <Nav.Link key="storage" href="#" onClick={goToStorage}>
                Saved results
              </Nav.Link>
            )}

            {(appState.mode === "Loading" ||
              appState.mode === "Result" ||
              appState.mode === "Storage") && (
              <Nav.Link
                key={`new-${appState.mode}`}
                href="#"
                onClick={newSearch}
              >
                New search
              </Nav.Link>
            )}

            {appState.mode === "LoadingProgressive" && (
              <Nav.Link key="cancel" href="#" onClick={cancelSearch}>
                Cancel search
              </Nav.Link>
            )}
            {appState.mode === "Result" && (
              <>
                <NavDropdown
                  title={`Travel mode: ${TravelMode[prompt.travelMode]}`}
                  key="travelMode"
                >
                  {Object.entries(TravelMode).map(([value, label], index) =>
                    prompt.travelMode !== value ? (
                      <NavDropdown.Item
                        onClick={() => setTravelMode(value as TravelModeType)}
                        key={`travelmode-${index}`}
                      >
                        {label}
                      </NavDropdown.Item>
                    ) : (
                      <React.Fragment key={`empty-${index}`} />
                    )
                  )}
                </NavDropdown>
                <Nav.Link key="directions" href="#" onClick={toggleDirections}>
                  Directions: {view.directions ? "show" : "hide"}
                </Nav.Link>
                <Nav.Link key="view" href="#" onClick={toggleCompact}>
                  View: {view.compact ? "compact" : "full"}
                </Nav.Link>
                <Nav.Link
                  key="save"
                  href="#"
                  onClick={saveResults}
                  disabled={isSaved}
                >
                  Save
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
