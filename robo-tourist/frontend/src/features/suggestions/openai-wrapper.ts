const BACKEND_URL = "/api/suggestions";

export const getSuggestions = async (target: string, preference?: string) => {
  const response = await fetch(
    `${BACKEND_URL}?target=${encodeURIComponent(
      target
    )}&preference=${encodeURIComponent(preference)}`,
    { method: "GET" }
  );
  if (response.ok) return (await response.json()).suggestions;
  else throw new Error(response.statusText);
};
