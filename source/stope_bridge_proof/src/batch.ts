import { Field, MerkleTree, Mina, NetworkId, PrivateKey } from "o1js";
import fs from "fs";
import path from "path";
// import { HEIGHT, MerkleWitness20 } from "@taigalabs/stope-entities";

import { Bridge } from "./bridge.js";
import { Assets } from "../externals/sto.js";
import { MerkleWitness20, HEIGHT } from "../externals/tree.js";

export const SECRET = "secret";

const DATA_PATH = path.resolve("../../source/stope_mock_data/data");
const stosPath = path.resolve(DATA_PATH, "stos.json");
const treePath = path.resolve(DATA_PATH, "tree.json");
const witnessesPath = path.resolve(DATA_PATH, "witnesses.json");

const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
const treeJson = JSON.parse(fs.readFileSync(treePath).toString());
const witnessesJson = JSON.parse(fs.readFileSync(witnessesPath).toString());

async function execBridgeProcess() {
  /**
   * This script can be used to interact with the Add contract, after deploying it.
   *
   * We call the update() method on the contract, create a proof and send it to the chain.
   * The endpoint that we interact with is read from your config.json.
   *
   * This simulates a user interacting with the zkApp from a browser, except that here, sending the transaction happens
   * from the script and we're using your pre-funded zkApp account to pay the transaction fee. In a real web app, the user's wallet
   * would send the transaction and pay the fee.
   *
   * To run locally:
   * Build the project: `$ npm run build`
   * Run with node:     `$ node build/src/interact.js <deployAlias>`.
   */

  // check command line arg
  let deployAlias = "test-2";
  // let deployAlias = process.argv[2];
  if (!deployAlias)
    throw Error(`Missing <deployAlias> argument.

Usage:
node build/src/interact.js <deployAlias>
`);
  Error.stackTraceLimit = 1000;
  const DEFAULT_NETWORK_ID = "testnet";

  // parse config and private key from file
  type Config = {
    deployAliases: Record<
      string,
      {
        networkId?: string;
        url: string;
        keyPath: string;
        fee: string;
        feepayerKeyPath: string;
        feepayerAlias: string;
      }
    >;
  };
  let configJson: Config = JSON.parse(fs.readFileSync("config.json", "utf8"));
  let config = configJson.deployAliases[deployAlias];
  let feepayerKeysBase58: { privateKey: string; publicKey: string } =
    JSON.parse(fs.readFileSync(config.feepayerKeyPath, "utf8"));

  let zkAppKeysBase58: { privateKey: string; publicKey: string } = JSON.parse(
    fs.readFileSync(config.keyPath, "utf8")
  );

  let feepayerKey = PrivateKey.fromBase58(feepayerKeysBase58.privateKey);
  let zkAppKey = PrivateKey.fromBase58(zkAppKeysBase58.privateKey);

  // set up Mina instance and contract we interact with
  const Network = Mina.Network({
    // We need to default to the testnet networkId if none is specified for this deploy alias in config.json
    // This is to ensure the backward compatibility.
    networkId: (config.networkId ?? DEFAULT_NETWORK_ID) as NetworkId,
    mina: config.url,
  });
  // const Network = Mina.Network(config.url);
  const fee = Number(config.fee) * 1e9; // in nanomina (1 billion = 1.0 mina)
  Mina.setActiveInstance(Network);
  let feepayerAddress = feepayerKey.toPublicKey();
  let zkAppAddress = zkAppKey.toPublicKey();
  let zkApp = new Bridge(zkAppAddress);

  // compile the contract to create prover keys
  console.log("compile the contract...");
  await Bridge.compile();

  try {
    // call update() and send transaction
    console.log("build transaction and create proof...");
    let tx = await Mina.transaction(
      { sender: feepayerAddress, fee },
      async () => {
        const tree = new MerkleTree(HEIGHT);

        const stos = stosJson.map((_sto: any, idx: number) => {
          const sto = {
            leaf: Field.fromJSON(_sto.leaf),
            userPublic: Field.fromJSON(_sto.userPublic),
            isin: Field.fromJSON(_sto._isin),
            balance: Field.fromJSON(_sto._balance),
          };

          tree.setLeaf(BigInt(idx), sto.leaf);

          return sto;
        });
        const assets = new Assets({ stos });

        const root = Field.fromJSON(treeJson.root);
        const totalBalance = Field.fromJSON(treeJson.totalBalance);

        const witnesses = witnessesJson.map((wt: any) => {
          return MerkleWitness20.fromJSON(wt);
        });

        const firstLeaf = stos[0].leaf;
        const firstLeafWitness = witnesses[0];

        zkApp.aggregate(assets, root, totalBalance, firstLeafWitness);
      }
    );
    await tx.prove();

    console.log("send transaction...");
    const sentTx = await tx.sign([feepayerKey]).send();
    if (sentTx.status === "pending") {
      console.log(
        "\nSuccess! Update transaction sent.\n" +
          "\nYour smart contract state will be updated" +
          "\nas soon as the transaction is included in a block:" +
          `\n${getTxnUrl(config.url, sentTx.hash)}`
      );
    }
  } catch (err) {
    console.log(err);
  }
}

function getTxnUrl(graphQlUrl: string, txnHash: string | undefined) {
  const txnBroadcastServiceName = new URL(graphQlUrl).hostname
    .split(".")
    .filter((item) => item === "minascan" || item === "minaexplorer")?.[0];
  const networkName = new URL(graphQlUrl).hostname
    .split(".")
    .filter((item) => item === "berkeley" || item === "testworld")?.[0];
  if (txnBroadcastServiceName && networkName) {
    return `https://minascan.io/${networkName}/tx/${txnHash}?type=zk-tx`;
  }
  return `Transaction hash: ${txnHash}`;
}

export async function exportSTO() {
  console.log("exporting STO");

  await execBridgeProcess();
}

exportSTO();
