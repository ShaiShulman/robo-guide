import { FormEventHandler, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TravelMode } from "../map/interfaces";

interface PromptFormProps {
  onFormSubmit: (
    target: string,
    preference: string,
    origin: string,
    transporationMode: TravelMode
  ) => void;
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [travelMode, setTravelMode] = useState<TravelMode>("Walking");

  const [validated, setValidated] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form: any = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      props.onFormSubmit(prompt, preference, origin, travelMode);
    }
    setValidated(true);
  };

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Where are you going?</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter a name of a region, city or neighbourhood"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            You must enter a place name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>What do you like?</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a list of interests, seperated with a comma"
            value={preference}
            onChange={(e) => {
              setPreference(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Where are you staying?</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a name of city, attraction, street address or leave blank"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Travel Mode</Form.Label>
          <Form.Select
            value={travelMode}
            onChange={(e) => {
              setTravelMode(e.target.value as TravelMode);
            }}
          >
            <option>Walking</option>
            <option>Public Transport</option>
            <option>Driving</option>
          </Form.Select>
        </Form.Group>
        <div>
          <Button type="submit">Get Recommendations!</Button>
        </div>
      </Form>
    </div>
  );
};

export default PromptForm;
