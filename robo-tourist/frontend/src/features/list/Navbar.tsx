import { Button, FloatingLabel, Form } from "react-bootstrap";
import { TravelMode } from "../../globals/interfaces";
import "./Navbar.css";

interface NavbarProps {
  travelMode: TravelMode;
  showDirections: boolean;
  onNewSearch: () => void;
  onChangeTravelMode: (travelMode: TravelMode) => void;
  onChangeShowDirections: (showDirections: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  travelMode,
  showDirections,
  onNewSearch,
  onChangeTravelMode,
  onChangeShowDirections,
}) => {
  return (
    <div className="navbar-container">
      <Form className="form-flex">
        <Button onClick={() => onNewSearch()}>New Search</Button>
        <FloatingLabel controlId="floatingSelect" label="Travel mode">
          <Form.Select
            aria-label="Travel mode"
            value={travelMode}
            onChange={(e) => onChangeTravelMode(e.target.value as TravelMode)}
          >
            <option>Walking</option>
            <option>Public Transport</option>
            <option>Driving</option>
          </Form.Select>
        </FloatingLabel>
        <Form.Check
          type="switch"
          label="Directions"
          checked={showDirections}
          onChange={(e) => onChangeShowDirections(e.target.checked)}
        />
      </Form>
    </div>
  );
};

export default Navbar;
