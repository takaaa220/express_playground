import express from "express";
import bodyParser from "body-parser";
import { TeamController } from "../../presentations/controllers/Team/teamController";

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const teamController = new TeamController();

router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

router.post("/team", async (req, res) => {
  const team = await teamController.create(req.body);

  res.json({ team });
});

export default router;
