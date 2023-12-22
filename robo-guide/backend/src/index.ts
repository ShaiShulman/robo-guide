import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { getSuggestions } from "./suggestions/openai";
import { getImagesFromGoogleSearch } from "./place-images/image-scraper";
import { jsonResponseMiddleware } from "./middleware/jsonResponseMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import { TEXT_COLOR } from "./const";

const app = express();
const port = process.env.PORT || "8000";

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