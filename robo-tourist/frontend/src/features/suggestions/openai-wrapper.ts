const SUGGESTIONS_BACKEND_URL = "/api/suggestions";

export const getSuggestions = async (target: string, preference?: string) => {
  try {
    const response = await fetch(
      `${SUGGESTIONS_BACKEND_URL}?target=${encodeURIComponent(
        target
      )}&preference=${encodeURIComponent(preference)}`,
      { method: "GET" }
    );
    if (response.ok) return (await response.json()).data;
    else {
      const json = await response.json();
      if (json && json.error) throw new Error(json.error);
      throw new Error(
        `Error communicating with backend! ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
};
