import express from "express";

import { v0Router } from "../router/index.js";

const PORT = 3000;
const API_V0 = "api/v0";

export async function runServer() {
  const app = express();

  app.get("/", (_req, res) => {
    res.send({ status: "running" });
  });

  app.use(API_V0, v0Router);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
