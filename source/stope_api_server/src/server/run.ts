import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { v0Router } from "@/router";
import { connectDB } from "@/db";

const PORT = 4000;
const API_V0 = "/api/v0";

export async function runServer() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    console.log(req.url, req.method, req.body);
    next();
  });

  app.get("/", (_req, res) => {
    res.send({ status: "running" });
  });

  app.use(API_V0, v0Router);

  const state = await makeState();
  app.locals = state;

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

}

async function makeState() {
  const db = await connectDB();

  return {
    db,
  };
}


