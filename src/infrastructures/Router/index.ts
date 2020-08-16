import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import TeamRouter from "./Team";
import ChannelRouter from "./Team/Channel";

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

router.use("/team", TeamRouter);
router.use("/team/:teamId/channel", ChannelRouter);

// エラー時のログを収集する
const logErrors = (err: Error, _: Request, __: Response, next: NextFunction) => {
  console.error(err.stack);
  next(err);
};

// エラーハンドリング
// @TODO: Controllerでいい感じに詰め替える
// @TODO: async function内のエラーはどうやら拾えない様子なので、修正する
const errorHandler = (_: Error, __: Request, res: Response, ___: NextFunction) => {
  res.status(500);
  res.json({ error: "エラーが発生しました" });
};

router.use(logErrors);
router.use(errorHandler);

export default router;
