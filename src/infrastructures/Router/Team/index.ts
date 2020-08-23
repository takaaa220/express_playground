import express from "express";
import { TeamController } from "../../../presentations/controllers/Team/teamController";
import { wrapHandler } from "../../helpers/middlewares";

const router = express.Router();

const teamController = new TeamController();

router
  .route("/")
  .get(wrapHandler(() => teamController.getAll()))
  .post(wrapHandler((req) => teamController.create(req.body)));

router
  .route("/:teamId")
  .put(wrapHandler((req) => teamController.update(req.params, req.body)))
  .delete(wrapHandler((req) => teamController.delete(req.params)));

router
  .route("/:teamId/removeUser")
  .post(wrapHandler((req) => teamController.removeUser(req.params, req.body)));

router
  .route("/:teamId/invite")
  .post(wrapHandler((req) => teamController.inviteUser(req.params, req.body)));

router
  .route("/:teamId/changeOwner/:newOwnerId")
  .post(wrapHandler((req) => teamController.changeOwner(req.params)));

export default router;
