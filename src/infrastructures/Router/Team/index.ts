import express from "express";
import { TeamController } from "../../../presentations/controllers/Team/teamController";

const router = express();

const teamController = new TeamController();

router.post("/", async (req, res) => {
  const team = await teamController.create(req.body);

  res.json({ team });
});

router.post("/:teamId/invite", async (req, res) => {
  const team = await teamController.inviteUser(req.params, req.body);

  res.json({ team });
});

export default router;
