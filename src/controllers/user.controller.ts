import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { CustomRequestType } from "../types";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const SALT_VALUE = Number(process.env.SALT_VALUE);

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all the fields" });
  }
  try {
    const user: User | null = await db.user.findUnique({
      where: { username: username }
    });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: 86400
    });
    const resp = { id: user.id, username: user.username, auth: true, token };
    res.status(200).json(resp);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, username, password } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ msg: "Please enter all the fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password should be atleast 6 characters" });
  }
  try {
    const existingUser = await db.user.findUnique({
      where: { username: username }
    });
    if (existingUser) {
      return res.status(409).json({ msg: "Existing User. Please login" });
    }
    const salt = await bcrypt.genSalt(SALT_VALUE);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await db.user.create({
      data: { username, password: hashedPassword, name }
    });
    console.log("User created successfully");
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: 86400
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      username: user.username,
      auth: true,
      token: token
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

export const home = (req: Request, res: Response) => {
  console.log(`User ${(req as CustomRequestType).userId} is logged in`);
  res.status(200).json({ msg: "Welcome Home" });
};
