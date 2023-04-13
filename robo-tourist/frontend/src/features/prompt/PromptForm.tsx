import { FormEventHandler, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TravelMode, TravelModeType } from "../../data/interfaces";
import { AppDispatch } from "../../store/store";
import { promptActions, selectPrompt } from "../../store/promptSlice";
import { useDispatch, useSelector } from "react-redux";

interface PromptFormProps {
  onFormSubmit: (promptInfo) => void;
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [travelMode, setTravelMode] = useState<TravelModeType>();

  const [validated, setValidated] = useState(false);

  const defualtPrompt = useSelector(selectPrompt);

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form: any = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      dispatch(
        promptActions.update({ target: prompt, preference, origin, travelMode })
      );
      props.onFormSubmit({ target: prompt, preference, origin, travelMode });
    }
    setValidated(true);
  };

  useEffect(() => {
    setPrompt(defualtPrompt.target);
    setPreference(defualtPrompt.preference);
    setOrigin(defualtPrompt.origin);
    setTravelMode(defualtPrompt.travelMode);
  }, []);

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Where are you going?</Form.Label>
          <Form.Control
            type="text"
            minLength={3}
            maxLength={20}
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
            minLength={3}
            maxLength={70}
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
              setTravelMode(e.target.value as TravelModeType);
            }}
          >
            {Object.entries(TravelMode).map(([value, label]) => (
              <option key={value}>{label}</option>
            ))}
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
