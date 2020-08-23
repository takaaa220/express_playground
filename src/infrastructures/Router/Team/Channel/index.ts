import express from "express";
import { ChannelController } from "../../../../presentations/controllers/Channel/channelController";
import MessageRouter from "./Message";
import { wrapHandler } from "../../../helpers/middlewares";

const router = express.Router({ mergeParams: true });

const channelController = new ChannelController();

router
  .route("/")
  .get(wrapHandler((req) => channelController.getAll(req.params)))
  .post(wrapHandler((req) => channelController.create(req.params, req.body)));

router
  .route("/:channelId")
  .put(wrapHandler((req) => channelController.update(req.params, req.body)))
  .delete(wrapHandler((req) => channelController.delete(req.params)));

router
  .route("/:channelId/changeStatus")
  .put(wrapHandler((req) => channelController.changeStatus(req.params, req.body)));

router.route("/:channelId/join").post(wrapHandler((req) => channelController.join(req.params)));

router.route("/:channelId/leave").post(wrapHandler((req) => channelController.leave(req.params)));

router
  .route("/:channelId/invite")
  .post(wrapHandler((req) => channelController.invite(req.params, req.body)));

router
  .route("/:channelId/removeUser")
  .delete(wrapHandler((req) => channelController.removeUser(req.params, req.body)));

router.use("/:channelId/message", MessageRouter);

export default router;
