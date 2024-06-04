import express, { NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Request, Response } from "express";
import { getSuggestions } from "./suggestions/openai";
import { getImagesFromGoogleSearch } from "./place-images/image-scraper";
import { jsonResponseMiddleware } from "./middleware/jsonResponseMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import { Readable } from "stream";
import { TEXT_COLOR } from "./const";
import { getRateLimiter } from "./middleware/rateLimiter";

if (process.env.NODE_ENV !== "production") dotenv.config();

const app = express();
const port = process.env.PORT || "8000";

const rateLimit = getRateLimiter();

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    TEXT_COLOR.blue,
    `${req.method} ${req.originalUrl} | ${new Date().toISOString()}`,
    TEXT_COLOR.black
  );
  next();
});

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.locals.results = "Welcome to the RoboGuide API";
  next();
});

app.get(
  "/api/suggestions",
  rateLimit,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.query.target as string;
      const preference = req.query.preference as string | undefined;
      const origin = req.query.origin as string | undefined;
      const emitter = await getSuggestions(target, preference, origin);
      const stream = new Readable({
        read() {},
      });
      emitter.on("line", (line) => {
        stream.push(line);
      });
      emitter.on("end", () => {
        stream.push(null);
      });
      emitter.on("error", (error) => {
        stream.emit("error", error);
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      stream.pipe(res);
    } catch (error: any) {
      next(error);
    }
  }
);

app.get(
  "/api/images",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const places = req.query.places as string;
      const target = req.query.target as string;
      const preference = req.query.preference as string;
      if (!places)
        throw new Error("Request error! list of places must be specified");
      if (!target)
        throw new Error("Request error! search target must be specified");
      const placesArr = places.split(",");
      const images = await getImagesFromGoogleSearch(placesArr, target);
      res.locals.results = images.map((image, index) => ({
        place: placesArr[index],
        image: image,
      }));
      next();
    } catch (error: any) {
      next(error);
    }
  }
);

app.use(jsonResponseMiddleware);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
