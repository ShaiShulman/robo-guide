import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import { FormEventHandler, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TravelMode, TravelModeType } from "../../data/interfaces";
import { AppDispatch } from "../../store/store";
import { promptActions, selectPrompt } from "../../store/promptSlice";
import { useDispatch, useSelector } from "react-redux";
import { preferenceOptions } from "./const";
import PlaceSelectControl from "../../components/PlaceSelectControl";

interface PromptFormProps {
  onFormSubmit: (promptInfo) => void;
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [preference, setPreference] = useState("");
  const [origin, setOrigin] = useState("");
  const [travelMode, setTravelMode] = useState<TravelModeType>();

  const [validated, setValidated] = useState(false);

  const defaultPrompt = useSelector(selectPrompt);

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form: any = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      dispatch(
        promptActions.update({
          target: prompt,
          preference,
          origin,
          travelMode,
        })
      );
      props.onFormSubmit({ target: prompt, preference, origin, travelMode });
    }
    setValidated(true);
  };

  useEffect(() => {
    setPrompt(defaultPrompt.target);
    setPreference(defaultPrompt.preference);
    setOrigin(defaultPrompt.origin);
    setTravelMode(defaultPrompt.travelMode);
    console.log(defaultPrompt);
  }, []);

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Where are you going?</Form.Label>
          <PlaceSelectControl
            id="select-prompt"
            value={defaultPrompt.target}
            minLength={3}
            maxLength={30}
            required={true}
            placeholder="Enter a name of a region, city or neighbourhood"
            restrictSearchRegions={true}
            onUpdate={(value) => setPrompt(value)}
          />
          <Form.Control.Feedback type="invalid">
            You must enter a region name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>What kind of attractions are you looking for?</Form.Label>
          <Typeahead
            id="select-preference"
            labelKey="preferences"
            options={preferenceOptions}
            placeholder="Enter or select the type of places you are looking for"
            defaultSelected={[defaultPrompt.preference]}
            onChange={(selected: any) => {
              if (selected[0]) setPreference(selected[0].toString());
            }}
            onInputChange={(input) => setPreference(input)}
            filterBy={() => true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Where are you staying?</Form.Label>
          <PlaceSelectControl
            id="select-origin"
            value={defaultPrompt.origin}
            minLength={3}
            maxLength={70}
            placeholder="Enter a name of city, attraction, street address or leave blank"
            restrictSearchLocation={prompt}
            onUpdate={(value) => setOrigin(value)}
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
        <div></div>
        <div>
          <Button type="submit">Get Recommendations!</Button>
        </div>
      </Form>
    </div>
  );
};

export default PromptForm;
