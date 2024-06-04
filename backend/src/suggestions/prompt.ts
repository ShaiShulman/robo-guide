const MAX_TARGET_LENGTH = 70;
const MAX_PREF_LENGTH = 120;

const INSTRUCTIONS =
  "Give me 10 recommendations for places to visit and provide two paragarphs describing the place and why i should visit each one (do not seperate the description into multiple lines)." +
  "Put each place on a new line and separate the place name from the description with a colon. Don't use bullets or numbers, return only the list of recommendations.";

export const getPrompt = (
  target: string,
  preference?: string,
  origin?: string
) => {
  if (!target)
    throw new Error("Input Error! Target parameter must be provided.");
  if (target.length > MAX_TARGET_LENGTH)
    throw new Error("Input Error! Target name exceed maximum length.");
  if (preference && preference.length > MAX_PREF_LENGTH)
    throw new Error("Input Error! Preference exceed maximum length.");

  const prompt =
    `I'm visiting ${target} ${
      preference && preference.length > 3
        ? "and I'm looking for " + preference
        : ""
    }` +
    INSTRUCTIONS +
    (origin
      ? `Include in your search according to the above instructions only places within a reasonable distance from ${origin}. Provide only the list of locations per the above instructions and nothing more.`
      : "");

  return prompt;
};
