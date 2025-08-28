import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ZodError } from "zod";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const message = "Validation failed";
    const errors = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    error = new ApiError(400, message, errors);
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    const message = "Duplicate field value entered";
    error = new ApiError(409, message);
  }

  if (err.code === 'P2025') {
    const message = "Record not found";
    error = new ApiError(404, message);
  }

  // If it's not an ApiError, create one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message);
  }

  res.status(error.statusCode).json({
    success: error.success,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export { errorHandler };
