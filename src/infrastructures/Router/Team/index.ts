import express from "express";
import { TeamController } from "../../../presentations/controllers/Team/teamController";

const router = express.Router();

const teamController = new TeamController();

router.route("/").get(async (_, res) => {
  const response = await teamController.getAll();

  res.json(response);
});

router.route("/").post(async (req, res) => {
  const response = await teamController.create(req.body);

  res.json(response);
});

router.route("/:teamId").delete(async (req, res) => {
  const response = await teamController.delete(req.params);

  res.json(response);
});

router.route("/:teamId/invite").post(async (req, res) => {
  const response = await teamController.inviteUser(req.params, req.body);

  res.json(response);
});

router.route("/:teamId/changeOwner/:newOwnerId").post(async (req, res) => {
  const response = await teamController.changeOwner(req.params);

  res.json(response);
});

export default router;
