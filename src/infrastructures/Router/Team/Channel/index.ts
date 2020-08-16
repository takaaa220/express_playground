import express from "express";
import { ChannelController } from "../../../../presentations/controllers/Team/channelController";

const router = express.Router({ mergeParams: true });

const channelController = new ChannelController();

router.route("/").get(async (req, res) => {
  const channels = await channelController.getAll(req.params);

  res.json({ channels });
});

router.route("/").post(async (req, res) => {
  const channel = await channelController.create(req.params, req.body);

  // TODO: serialize
  res.json({ channel });
});

router.route("/:channelId").put(async (req, res) => {
  const channel = channelController.update(req.params, req.body);

  res.json({ channel });
});

router.route("/:channelId/invite").post(async (req, res) => {
  const channel = channelController.invite(req.params, req.body);

  res.json({ channel });
});

router.route("/:channelId/removeUser").delete(async (req, res) => {
  await channelController.removeUser(req.params, req.body);

  res.json({ status: "ok" });
});

export default router;
