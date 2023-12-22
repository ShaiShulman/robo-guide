const PHOTOS_BACKEND_URL = "/api/images";

export const getImagesFromBackend = async (
  places: string[],
  target: string,
  preference?: string
): Promise<{ place: string; image?: string }[]> => {
  try {
    const response = await fetch(
      `${PHOTOS_BACKEND_URL}?places=${places
        .map((place) => encodeURIComponent(place))
        .join(",")}
        &target=${encodeURIComponent(target)}&preference=${encodeURIComponent(
        preference
      )}`,
      { method: "GET" }
    );
    if (response.ok) return (await response.json()).data;
    else {
      const json = await response.json();
      if (json && json.error) throw new Error(json.error);
      throw new Error(
        `Error communicating with google image search! ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
};
