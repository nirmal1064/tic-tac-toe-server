import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { CustomRequestType, UserIdType } from "../types";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const sanitizeUserInput = () => {
  return [body("username").trim().escape(), body("password").trim().escape()];
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = <string>req.headers["x-access-token"];
  if (!token) return res.status(403).send({ auth: false, msg: "No token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as UserIdType;
    console.log(`User ${decoded.id} verified`);
    (req as CustomRequestType).userId = decoded.id;
    next();
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ msg: `Invalid Token ${err.message}` });
  }
};
