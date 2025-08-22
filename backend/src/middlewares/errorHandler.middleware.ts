import { ErrorRequestHandler, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  console.log(`Error occured on PATH: ${req.path}`, {
    body: req.body,
    params: req.params,
    error,
  });

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Invalid json format, please check your request body',
    });
  }

  //   if (error instanceof AppError) {
  //     return res.status(error.statusCode).json({
  //       message: error.message,
  //       errorCode: error.errorCode,
  //     });
  //   }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server error',
    error: error?.message || 'Unknown error',
  });
};
