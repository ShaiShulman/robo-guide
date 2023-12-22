export const getPlaceNameVariations = (placeName: string) => {
  const words = removeLeadingArticleAndQoute(placeName).split(" "); // split the string into an array of words
  const combinations = []; // initialize an empty array to store the combinations

  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      // iterate through every possible combination of two words
      const combination = words[i] + " " + words[j];
      if (
        combination.length >= 4 &&
        words[i].length >= 2 &&
        words[j].length >= 2
      ) {
        // add the combination to the array if it is at least 4 characters long and both words are at least 2 characters long
        combinations.push(combination);
      }
    }
  }

  combinations.sort((a, b) => b.length - a.length);

  return [removeLeadingArticleAndQoute(placeName), ...combinations];
};

const removeLeadingArticleAndQoute = (str: string) => {
  const leadingArticleRegex = /^(a|an|the|")\s/i;
  return str.replace(leadingArticleRegex, "");
};

export const searchUrl = (query: string, target: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(
    query.includes(target) ? query : query + "," + target
  )}&tbm=isch`;
