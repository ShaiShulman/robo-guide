import { createClient, RedisClientType } from "redis";
import { TEXT_COLOR } from "../const";

interface ImageCacheKey {
  place: string;
  target: string;
}

interface ImageCacheItem extends ImageCacheKey {
  image: string;
}

let redisClient: RedisClientType;

(async () => {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: 6379,
    },
    // password: process.env.REDIS_PASSWORD || undefined,
  });

  redisClient.on("error", (error: any) =>
    console.error(TEXT_COLOR.red, `Error : ${error}`, TEXT_COLOR.black)
  );

  await redisClient.connect();
})();

export const getImageFromCache = (
  key: ImageCacheKey
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const cacheImage = redisClient.get(`${key.place}:${key.target}`);
    if (cacheImage) resolve(cacheImage);
    else resolve(null);
  });
};

export const setImageToCache = async (item: ImageCacheItem) => {
  redisClient.set(`${item.place}:${item.target}`, item.image, {
    EX: (process.env.REDIS_EXPIRY as unknown as number) || 180,
    NX: true,
  });
};

process.on("SIGINT", () => {
  redisClient.quit();
});
