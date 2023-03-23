import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { TravelMode } from "../../globals/interfaces";
import getDispatch from "../../lib/get-dispatch";
import { appActions } from "../../store/appSlice";
import { markersActions } from "../../store/markerSlice";
import { promptActions, selectPrompt } from "../../store/promptSlice";
import { selectView, viewActions } from "../../store/viewSlice";
import "./Navbar.css";

const Navbar: React.FC = ({}) => {
  const dispatch = getDispatch();

  const newSearch = () => {
    dispatch(markersActions.reset());
    dispatch(appActions.setMode("Prompt"));
  };

  const view = useSelector(selectView);
  const prompt = useSelector(selectPrompt);

  return (
    <div className="navbar-container">
      <Form className="form-flex">
        <Button onClick={() => newSearch()}>New Search</Button>
        <FloatingLabel controlId="floatingSelect" label="Travel mode">
          <Form.Select
            aria-label="Travel mode"
            value={prompt.travelMode}
            onChange={(e) =>
              promptActions.updateTravelMode(e.target.value as TravelMode)
            }
          >
            <option>Walking</option>
            <option>Public Transport</option>
            <option>Driving</option>
          </Form.Select>
        </FloatingLabel>
        <Form.Check
          type="switch"
          label="Directions"
          checked={view.directions}
          onChange={(e) => viewActions.setdirections(e.target.checked)}
        />
      </Form>
    </div>
  );
};

export default Navbar;
