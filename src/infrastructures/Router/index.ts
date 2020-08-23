import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import TeamRouter from "./Team";
import ChannelRouter from "./Team/Channel";
import { logErrors, errorHandler } from "../helpers/middlewares";

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/team", TeamRouter);
router.use("/team/:teamId/channel", ChannelRouter);

// エラーハンドリング
router.use(logErrors);
router.use(errorHandler);

export default router;
