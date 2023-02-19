import { useState } from "react";
import { getSuggestions } from "../suggestions/openai";

interface PromptFormProps {
  onNewSuggestions: (suggestions: string[]) => void;
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const [prompt, setPrompt] = useState<string>("");

  const handeSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    getSuggestions(
      `I'm visiting ${prompt}, I'm 41 and I don't like museums. Give me 10 recommendations what to visit`
    ).then((result) => {
      if (result)
        props.onNewSuggestions(
          result.split(",").map((place) => `${place}, ${prompt}`)
        );
    });
  };
  return (
    <form>
      <input
        type={"text"}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handeSubmit}></button>
    </form>
  );
};

export default PromptForm;
