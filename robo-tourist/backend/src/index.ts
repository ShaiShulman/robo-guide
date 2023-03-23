import express, { NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { getSuggestions } from "./openai";

const TEXT_BLUE = "\x1b[34m%s\x1b[0";

const app = express();
const port = process.env.PORT || "8000";

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    TEXT_BLUE,
    `${req.method} ${req.originalUrl} | ${new Date().toISOString()}`
  );
  next();
});

app.get("/api/test", async (req, res) => {
  const { url, method, headers, body } = req.body;
  res.json("Working OK");
});

app.get("/api/suggestions", async (req: Request, res: Response) => {
  try {
    const target = req.query.target as string;
    const preference = req.query.preference as string | undefined;
    const results = await getSuggestions(target, preference);
    res.json({ suggestions: results });
  } catch (error: any) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
