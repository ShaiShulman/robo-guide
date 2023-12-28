import { getStreamedResponse } from "./stream-utils";

const SUGGESTIONS_BACKEND_URL = "/api/suggestions";

export const getSuggestions = async (
  target: string,
  preference: string | null,
  onNewPlace: (place: string) => void,
  signal?: AbortSignal
) => {
  try {
    await getStreamedResponse(
      `${SUGGESTIONS_BACKEND_URL}?target=${encodeURIComponent(
        target
      )}&preference=${encodeURIComponent(preference)}`,
      (_, value) => {
        onNewPlace(value);
      },
      signal
    );
  } catch (error) {
    throw error;
  }
};
