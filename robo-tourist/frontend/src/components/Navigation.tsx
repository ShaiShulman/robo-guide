import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import getDispatch from "../lib/get-dispatch";
import { appActions, resetAppState, selectAppState } from "../store/appSlice";
import { markersActions } from "../store/markerSlice";
import { promptActions, selectPrompt } from "../store/promptSlice";
import { selectView, viewActions } from "../store/viewSlice";
import brandLogo from "../../assets/brand-logo.png";
import { TravelMode } from "../globals/interfaces";
// import "./Navbar.css";

const Navigation: React.FC = ({}) => {
  const dispatch = getDispatch();

  const appState = useSelector(selectAppState);

  const newSearch = (e: any) => {
    dispatch(resetAppState());
    e.preventDefault();
  };

  const view = useSelector(selectView);
  const prompt = useSelector(selectPrompt);

  const toggleDirections = (e: any) => {
    dispatch(viewActions.toggleDirections());
    e.preventDefault();
  };

  const toggleCompact = (e: any) => {
    dispatch(viewActions.toggleCompact());
    e.preventDefault();
  };

  const setTravelMode = (value: TravelMode) => {
    dispatch(promptActions.updateTravelMode(value));
  };

  return (
    // <div className="navbar-container">
    <Navbar expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#">
        {/* <img src={brandLogo} alt="logo" /> */}
        Robo-Guide
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link href="#" onClick={newSearch}>
            New search
          </Nav.Link>
          {appState.mode === "Result" && (
            <>
              <NavDropdown title={`Travel mode: ${prompt.travelMode}`}>
                {prompt.travelMode !== "Walking" && (
                  <NavDropdown.Item onClick={() => setTravelMode("Walking")}>
                    Walking
                  </NavDropdown.Item>
                )}
                {prompt.travelMode !== "Transit" && (
                  <NavDropdown.Item onClick={() => setTravelMode("Transit")}>
                    Public Transport
                  </NavDropdown.Item>
                )}
                {prompt.travelMode !== "Driving" && (
                  <NavDropdown.Item onClick={() => setTravelMode("Driving")}>
                    Driving
                  </NavDropdown.Item>
                )}
              </NavDropdown>
              <Nav.Link href="#" onClick={toggleDirections}>
                Directions: {view.directions ? "show" : "hide"}
              </Nav.Link>
              <Nav.Link href="#" onClick={toggleCompact}>
                View: {view.compact ? "compact" : "full"}
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    // </div>
  );
};

export default Navigation;
