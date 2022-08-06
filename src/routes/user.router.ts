import { Router } from "express";
import { home, login, register } from "../controllers/user.controller";
import { sanitizeUserInput, verifyToken } from "../middlewares";

const userRouter: Router = Router();

userRouter.post("/login", sanitizeUserInput(), login);
userRouter.post("/register", sanitizeUserInput(), register);
userRouter.get("/home", verifyToken, home);

export default userRouter;
