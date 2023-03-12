import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getSuggestions = async (prompt: string) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 3000,
  });
  return splitResponse(completion.data.choices[0].text);
};

// export const getSuggestions = async (prompt: string) => {
//   const response = await fetch("https://api.openai.com/v1/chat/completion", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Replace accessToken with your actual access token
//     },
//     method: "POST",
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     }),
//   });
//   const data = await response.json();
//   console.log(data);
//   return splitResponse(data.choices[0].text);
// };

const splitResponse = (response: string) => {
  const regex = /^\d+\. (.*)$/gm;
  const matches = response.matchAll(regex);
  const items: string[] = [];

  for (const match of matches) {
    items.push(match[1]);
  }

  return items;
};
