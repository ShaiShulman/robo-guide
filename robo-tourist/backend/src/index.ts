import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { getSuggestions } from "./suggestions/openai";
import { getImagesFromGoogleSearch } from "./place-images/image-scraper";
import { jsonResponseMiddleware } from "./middleware/jsonResponseMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";

const TEXT_BLUE = "\x1b[34m%s\x1b[0";
const TEXT_BLACK = "\x1b[30m";

const app = express();
const port = process.env.PORT || "8000";

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    TEXT_BLUE,
    `${req.method} ${req.originalUrl} | ${new Date().toISOString()}`,
    TEXT_BLACK
  );
  next();
});

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.locals.results = "Welcome to the RoboGuide API";
  next();
});

app.get(
  "/api/suggestions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.query.target as string;
      const preference = req.query.preference as string | undefined;
      const suggestions = await getSuggestions(target, preference);
      res.locals.results = suggestions;
    } catch (error: any) {
      next(error);
    }
    next();
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
      const images = await getImagesFromGoogleSearch(places.split(","), target);
      res.locals.results = images.map((image, index) => ({
        place: places[index],
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
