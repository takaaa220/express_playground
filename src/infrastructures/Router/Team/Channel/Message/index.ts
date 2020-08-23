import express from "express";
import { MessageController } from "../../../../../presentations/controllers/Message/messageController";
import { wrapHandler } from "../../../../helpers/middlewares";

const router = express.Router({ mergeParams: true });

const messageController = new MessageController();

router
  .route("/")
  .get(wrapHandler((req) => messageController.getAll(req.params)))
  .post(wrapHandler((req) => messageController.create(req.params, req.body)));

export default router;
