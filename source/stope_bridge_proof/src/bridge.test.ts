import {
  AccountUpdate,
  Field,
  MerkleTree,
  Mina,
  PrivateKey,
  PublicKey,
} from "o1js";
import path from "path";
import fs from "fs";

import { Bridge } from "./bridge";
import {
  mockAssets,
  mockAssets2,
  mockUser,
  mockUser2,
} from "../externals/mock_data";
import { makeLeaf } from "../externals/make_leaf";
import { HEIGHT } from "../externals/tree";
import { Assets } from "../externals/sto";
import { MerkleWitness20 } from "../externals/tree";

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

const DATA_PATH = path.resolve("../../source/stope_mock_data/data");
const stosPath = path.resolve(DATA_PATH, "stos.json");
const treePath = path.resolve(DATA_PATH, "tree.json");
const witnessesPath = path.resolve(DATA_PATH, "witnesses.json");

const stosPath2 = path.resolve(DATA_PATH, "stos2.json");
const treePath2 = path.resolve(DATA_PATH, "tree2.json");
const witnessesPath2 = path.resolve(DATA_PATH, "witnesses2.json");

console.log("data_path", DATA_PATH);
console.log("stosPath", stosPath);
console.log("treePath", treePath);

describe("Add", () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Bridge;

  beforeAll(async () => {
    if (proofsEnabled) await Bridge.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Bridge(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it("create_data", async () => {
    const tree = new MerkleTree(HEIGHT);

    const stosJson = [];
    let totalBalance = Field.fromValue(0);
    for (let idx = 0; idx < mockAssets.length; idx += 1) {
      const asset = mockAssets[idx];
      const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
        mockUser.secret,
        asset.isin,
        asset.balance
      );

      const d = {
        ...asset,
        leaf: leaf.toJSON(),
        userPublic: userPublic.toJSON(),
        _isin: _isin.toJSON(),
        _balance: _balance.toJSON(),
        _secret: _secret.toJSON(),
      };

      const bal = Field.fromValue(asset.balance);
      totalBalance = totalBalance.add(bal);
      tree.setLeaf(BigInt(idx), leaf);
      stosJson.push(d);
    }

    console.log("totalBalance", totalBalance);

    const root = tree.getRoot();
    const treeJson = {
      root: root.toJSON(),
      totalBalance: totalBalance.toJSON(),
    };

    fs.writeFileSync(stosPath, JSON.stringify(stosJson));
    fs.writeFileSync(treePath, JSON.stringify(treeJson));

    const witnesses = [];
    for (let idx = 0; idx < stosJson.length; idx += 1) {
      const witness = new MerkleWitness20(tree.getWitness(BigInt(idx)));
      // console.log(22, witness.toJSON());
      witnesses.push(witness.toJSON());
    }

    fs.writeFileSync(witnessesPath, JSON.stringify(witnesses));
    console.log("Wrote witness to file, path: %s", witnessesPath);
  });

  it("create_data2", async () => {
    const tree = new MerkleTree(HEIGHT);

    const stosJson = [];
    let totalBalance = Field.fromValue(0);
    for (let idx = 0; idx < mockAssets2.length; idx += 1) {
      const asset = mockAssets2[idx];
      const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
        mockUser2.secret,
        asset.isin,
        asset.balance
      );

      const d = {
        ...asset,
        leaf: leaf.toJSON(),
        userPublic: userPublic.toJSON(),
        _isin: _isin.toJSON(),
        _balance: _balance.toJSON(),
        _secret: _secret.toJSON(),
      };

      const bal = Field.fromValue(asset.balance);
      totalBalance = totalBalance.add(bal);
      tree.setLeaf(BigInt(idx), leaf);
      stosJson.push(d);
    }

    console.log("totalBalance", totalBalance);

    const root = tree.getRoot();
    const treeJson = {
      root: root.toJSON(),
      totalBalance: totalBalance.toJSON(),
    };

    fs.writeFileSync(stosPath2, JSON.stringify(stosJson));
    fs.writeFileSync(treePath2, JSON.stringify(treeJson));

    const witnesses = [];
    for (let idx = 0; idx < stosJson.length; idx += 1) {
      const witness = new MerkleWitness20(tree.getWitness(BigInt(idx)));
      // console.log(22, witness.toJSON());
      witnesses.push(witness.toJSON());
    }

    fs.writeFileSync(witnessesPath2, JSON.stringify(witnesses));
    console.log("Wrote witness to file, path: %s", witnessesPath2);
  });

  it("bridge_1", async () => {
    await localDeploy();

    const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
    const treeJson = JSON.parse(fs.readFileSync(treePath).toString());
    const witnessesJson = JSON.parse(fs.readFileSync(witnessesPath).toString());

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

    console.log(22, root, totalBalance, firstLeaf, firstLeafWitness);

    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.aggregate(assets, root, totalBalance, firstLeafWitness);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedRoot = zkApp.root.get();
    expect(updatedRoot).toEqual(root);
  });
});
