import express from "express";
import { TeamController } from "../../../presentations/controllers/Team/teamController";

const router = express.Router();

const teamController = new TeamController();

router.route("/").get(async (_, res) => {
  const teams = await teamController.getAll();

  res.json({ teams });
});

router.route("/").post(async (req, res) => {
  const team = await teamController.create(req.body);

  res.json({ team });
});

router.route("/:teamId").delete(async (req, res) => {
  await teamController.delete(req.params);

  res.json({ status: "ok" });
});

router.route("/:teamId/invite").post(async (req, res) => {
  const team = await teamController.inviteUser(req.params, req.body);

  res.json({ team });
});

router.route("/:teamId/changeOwner/:newOwnerId").post(async (req, res) => {
  await teamController.changeOwner(req.params);

  res.json({ status: "ok" });
});

export default router;
