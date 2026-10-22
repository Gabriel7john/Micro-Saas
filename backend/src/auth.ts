import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const secret = process.env.JWT_SECRET ?? "dev-secret";

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Faça login para continuar." });
  try {
    req.userId = (jwt.verify(token, secret) as { sub: string }).sub;
    next();
  } catch {
    res.status(401).json({ error: "Sessão expirada. Entre de novo." });
  }
}
