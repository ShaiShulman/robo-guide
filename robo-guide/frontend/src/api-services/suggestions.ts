import { appActions } from "../store/appSlice";
import { getStreamedResponse } from "./stream-utils";

const SUGGESTIONS_BACKEND_URL = "/api/suggestions";

export const getSuggestions = async (
  target: string,
  preference: string | null,
  origin: string | null,
  onNewPlace: (place: string) => void,
  onStreamEnd: () => void,
  signal?: AbortSignal
) => {
  try {
    await getStreamedResponse(
      `${SUGGESTIONS_BACKEND_URL}?target=${encodeURIComponent(
        target
      )}&preference=${encodeURIComponent(
        preference
      )}&origin=${encodeURIComponent(origin)}`,
      (_, value) => {
        onNewPlace(value);
      },
      onStreamEnd,
      signal
    );
    appActions.setMode("Result");
  } catch (error) {
    throw error;
  }
};
