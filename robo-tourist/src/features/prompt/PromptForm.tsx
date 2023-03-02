import { FormEventHandler, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getSuggestions } from "../suggestions/openai";

interface PromptFormProps {
  onNewSuggestions: (suggestions: string[], target: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [validated, setValidated] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form: any = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      getSuggestions(
        `I'm visiting ${prompt} ${
          preference.length > 3 ? "and i like " + preference : ""
        }. Give me 10 recommendations on what to visit`
      ).then((result) => {
        if (result) props.onNewSuggestions(result, prompt);
      });
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
        <div>
          <Button type="submit">Get Recommendations!</Button>
        </div>
      </Form>
    </div>
  );
};

export default PromptForm;
