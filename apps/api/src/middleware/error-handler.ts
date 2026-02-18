import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = 500;
  const message = error instanceof Error ? error.message : "Internal error";
  res.status(status).json({ error: message });
  next();
}
