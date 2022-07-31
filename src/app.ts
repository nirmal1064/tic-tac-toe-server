import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(cors());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

export default app;
