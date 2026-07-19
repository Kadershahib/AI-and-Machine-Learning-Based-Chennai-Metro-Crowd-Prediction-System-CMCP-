import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, email: admin.email });
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Admin already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { email, passwordHash },
  });

  res.status(201).json({ id: admin.id, email: admin.email });
}
