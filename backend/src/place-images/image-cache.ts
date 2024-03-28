import NodeCache from "node-cache";
import { TEXT_COLOR } from "../const";

interface ImageCacheKey {
  place: string;
  target: string;
}

interface ImageCacheItem extends ImageCacheKey {
  image: string;
}

let myCache = new NodeCache();

export const getImageFromCache = (
  key: ImageCacheKey
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const cacheImage = myCache.get(`${key.place}:${key.target}`);
    if (cacheImage) resolve(cacheImage as string);
    else resolve(undefined);
  });
};

export const setImageToCache = async (item: ImageCacheItem) => {
  myCache.set(`${item.place}:${item.target}`, item.image, 180);
};

process.on("SIGINT", () => {
  myCache.close();
});
