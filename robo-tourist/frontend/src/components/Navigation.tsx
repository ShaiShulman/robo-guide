import {
  Button,
  Container,
  FloatingLabel,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import getDispatch from "../lib/get-dispatch";
import { appActions } from "../store/appSlice";
import { markersActions } from "../store/markerSlice";
import { promptActions, selectPrompt } from "../store/promptSlice";
import { selectView, viewActions } from "../store/viewSlice";
import brandLogo from "../../assets/brand-logo.png";
// import "./Navbar.css";

const Navigation: React.FC = ({}) => {
  const dispatch = getDispatch();

  const newSearch = (e: any) => {
    dispatch(markersActions.reset());
    dispatch(appActions.setMode("Prompt"));
    e.preventDefault();
  };

  const view = useSelector(selectView);
  const prompt = useSelector(selectPrompt);

  const toggleDirections = (e: any) => {
    dispatch(viewActions.toggleDirections());
    e.preventDefault();
  };

  return (
    // <div className="navbar-container">
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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
          <NavDropdown title={`Travel mode: ${prompt.travelMode}`}>
            {prompt.travelMode !== "Walking" && (
              <NavDropdown.Item>Walking</NavDropdown.Item>
            )}
            {prompt.travelMode !== "Public Transport" && (
              <NavDropdown.Item>Public Transport</NavDropdown.Item>
            )}
            {prompt.travelMode !== "Driving" && (
              <NavDropdown.Item>Driving</NavDropdown.Item>
            )}
          </NavDropdown>
          <Nav.Link href="#" onClick={toggleDirections}>
            Directions: {view.directions ? "show" : "hide"}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    // </div>
  );
};

export default Navigation;
