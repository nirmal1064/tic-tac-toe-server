import express, { Request, Response } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import userRouter from "./routes/user.router";
import cookieParser from "cookie-parser";

const app = express();

const origins = process.env.ALLOWED_ORIGINS?.split(",");
const corsOptions: CorsOptions = { origin: origins, credentials: true };
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

export default app;
