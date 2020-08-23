import express from "express";
import { MessageController } from "../../../../../presentations/controllers/Message/messageController";

const router = express.Router({ mergeParams: true });

const messageController = new MessageController();

router.route("/").post(async (req, res) => {
  const response = await messageController.create(req.params, req.body);

  res.json(response);
});

export default router;
