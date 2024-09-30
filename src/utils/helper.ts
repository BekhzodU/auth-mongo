import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "./appError";

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const correctPassword = async function (
  candidatePassword?: string,
  userPassword?: string
) {
  if (!candidatePassword || !userPassword) return false;
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const getNewCookieDate = () => {
  return new Date(
    Date.now() +
      Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "1") *
        24 *
        60 *
        60 *
        1000
  );
};

export const catchError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode: number = err instanceof AppError ? err.statusCode : 500;
  const status: string = err instanceof AppError ? err.status : "error";
  const message: string = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status,
    message,
    error: err,
    stack: err.stack,
  });
};

export const unknownPageError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
