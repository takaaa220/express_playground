import express from "express";
import { ChannelController } from "../../../../presentations/controllers/Team/channelController";

const router = express.Router({ mergeParams: true });

const channelController = new ChannelController();

router.route("/").get(async (req, res) => {
  const response = await channelController.getAll(req.params);

  res.json(response);
});

router.route("/").post(async (req, res) => {
  const response = await channelController.create(req.params, req.body);

  res.json(response);
});

router.route("/:channelId").put(async (req, res) => {
  const response = await channelController.update(req.params, req.body);

  res.json(response);
});

router.route("/:channelId").delete(async (req, res) => {
  const response = await channelController.delete(req.params);

  res.json(response);
});

router.route("/:channelId/invite").post(async (req, res) => {
  const response = await channelController.invite(req.params, req.body);

  res.json(response);
});

router.route("/:channelId/removeUser").delete(async (req, res) => {
  const response = await channelController.removeUser(req.params, req.body);

  res.json(response);
});

export default router;
