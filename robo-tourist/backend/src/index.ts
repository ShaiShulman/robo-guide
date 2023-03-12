import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { getSuggestions } from "./openai";

const app = express();
const port = process.env.PORT || "8000";

app.use(cors());
app.use(express.json());

app.get("/api/test", async (req, res) => {
  const { url, method, headers, body } = req.body;
  res.json("Working OK");
});

app.get("/api/suggestions", async (req: Request, res: Response) => {
  const target = req.query.target as string;
  const preference = req.query.preference as string | undefined;
  const results = await getSuggestions(target, preference);
  res.json({ suggestions: results });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
