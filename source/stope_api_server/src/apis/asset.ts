import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve("../../source/stope_mock_data/data");
console.log("DATA_PATH: %s", DATA_PATH);

const stosPath = path.resolve(DATA_PATH, "stos.json");
const treePath = path.resolve(DATA_PATH, "tree.json");
const witnessesPath = path.resolve(DATA_PATH, "witnesses.json");

const stosPath2 = path.resolve(DATA_PATH, "stos2.json");
const treePath2 = path.resolve(DATA_PATH, "tree2.json");
const witnessesPath2 = path.resolve(DATA_PATH, "witnesses2.json");

const data = (function () {
  const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
  const treeJson = JSON.parse(fs.readFileSync(treePath).toString());
  const witnessesJson = JSON.parse(fs.readFileSync(witnessesPath).toString());

  const stosJson2 = JSON.parse(fs.readFileSync(stosPath).toString());
  const treeJson2 = JSON.parse(fs.readFileSync(treePath).toString());
  const witnessesJson2 = JSON.parse(fs.readFileSync(witnessesPath).toString());

  return {
    stosJson,
    treeJson,
    witnessesJson,
    stosJson2,
    treeJson2,
    witnessesJson2,
  };
})();

export async function get_sto_list(req: Request, res: Response) {
  const { username } = req.body;

  if (username === "elden") {
    res.send({
      stos: data.stosJson,
    });
  } else if (username === "elden2") {
    res.send({
      stos: data.stosJson2,
    });
  } else {
    res.send({
      stos: [],
    });
  }
}

export async function get_sto(req: Request, res: Response) {
  const { sto_id, username } = req.body;

  res.send({
    sto: data.stosJson[sto_id],
  });
}

export async function get_witness(req: Request, res: Response) {
  const { sto_id, username } = req.body;

  res.send({
    witness: data.witnessesJson[sto_id],
  });
}

export async function get_tree(req: Request, res: Response) {
  const { username } = req.body;

  res.send({
    tree: data.treeJson,
  });
}
