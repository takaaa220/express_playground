import { RequestHandler, NextFunction, Request, Response } from "express";

export const wrapHandler = <T>(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<T>,
): RequestHandler => async (req, res, next) => {
  try {
    const data = await handler(req, res, next);
    res.json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
};

// エラー時のログを収集する
export const logErrors = (err: Error, _: Request, __: Response, next: NextFunction) => {
  console.error(err.stack);
  next(err);
};

// エラーハンドリング
export const errorHandler = (e: Error, __: Request, res: Response, ___: NextFunction) => {
  res.status(500);
  res.json({ code: 500, message: e.message });
};
