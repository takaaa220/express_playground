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

export default router;
