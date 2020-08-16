import express from "express";
import { TeamController } from "../../../presentations/controllers/Team/teamController";

const router = express();

const teamController = new TeamController();

router.get("/", async (_, res) => {
  const teams = await teamController.getAll();

  res.json({ teams });
});

router.post("/", async (req, res) => {
  const team = await teamController.create(req.body);

  res.json({ team });
});

router.delete("/:teamId", async (req, res) => {
  await teamController.delete(req.params);

  res.json({ status: "ok" });
});

router.post("/:teamId/invite", async (req, res) => {
  const team = await teamController.inviteUser(req.params, req.body);

  res.json({ team });
});

router.post("/:teamId/changeOwner/:newOwnerId", async (req, res) => {
  await teamController.changeOwner(req.params);

  res.json({ status: "ok" });
});

export default router;
