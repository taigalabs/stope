import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { v0Router } from "@/router";

const PORT = 4000;
const API_V0 = "api/v0";

export async function runServer() {
  const app = express();

  app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
  });
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get("/", (_req, res) => {
    res.send({ status: "running" });
  });

  app.use(API_V0, v0Router);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
