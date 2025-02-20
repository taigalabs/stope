import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connectDB } from "@/db";
import { sign_in } from "@/apis/user";
import { get_sto, get_sto_list, get_tree, get_witness } from "@/apis/asset";

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

  app.post("/sign_in", sign_in);
  app.post("/get_sto_list", get_sto_list);
  app.post("/get_sto", get_sto);
  app.post("/get_witness", get_witness);
  app.post("/get_tree", get_tree);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
