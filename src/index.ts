import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({ message: "ok" });
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
