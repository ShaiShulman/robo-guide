const SUGGESTIONS_BACKEND_URL = "/api/suggestions";

export const getSuggestions = async (target: string, preference?: string) => {
  try {
    const response = await fetch(
      `${SUGGESTIONS_BACKEND_URL}?target=${encodeURIComponent(
        target
      )}&preference=${encodeURIComponent(preference)}`,
      { method: "GET" }
    );
    if (response.ok) {
      const results = (await response.json()).data;
      if (results.length === 0)
        throw new Error("search error! No results found!");
      return results;
    } else {
      const json = await response.json();
      if (json && json.error) throw new Error(json.error.message);
      throw new Error(
        `Error communicating with backend! ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
};
