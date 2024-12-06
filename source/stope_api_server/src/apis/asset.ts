import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve("../../source/stope_mock_data/data");
console.log("DATA_PATH: %s", DATA_PATH);

const stosPath = path.resolve(DATA_PATH, "stos.json");
const treePath = path.resolve(DATA_PATH, "tree.json");
const witnessesPath = path.resolve(DATA_PATH, "witnesses.json");

const data = (function () {
  const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
  const treeJson = JSON.parse(fs.readFileSync(treePath).toString());
  const witnessesJson = JSON.parse(fs.readFileSync(witnessesPath).toString());

  return { stosJson, treeJson, witnessesJson };
})();

export async function get_sto_list(_req: Request, res: Response) {
  res.send({
    stos: data.stosJson,
  });
}

export async function get_sto(req: Request, res: Response) {
  const { sto_id } = req.body;

  res.send({
    sto: data.stosJson[sto_id],
  });
}
