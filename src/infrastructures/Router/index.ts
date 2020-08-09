import express from "express";
import bodyParser from "body-parser";
import TeamRouter from "./Team";

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

router.use("/team", TeamRouter);

export default router;
