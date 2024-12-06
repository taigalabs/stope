import {
  AccountUpdate,
  Field,
  MerkleTree,
  Mina,
  PrivateKey,
  PublicKey,
} from "o1js";
import { Assets, HEIGHT, MerkleWitness20 } from "@taigalabs/stope-entities";
import path from "path";
import fs from "fs";
// import { mockAssets, mockUser } from "@taigalabs/stope-mock-data";
// import { makeLeaf } from '@taigalabs/stope-data-fns';

import { Bridge } from "./bridge";
import { mockAssets, mockUser } from "@taigalabs/stope-mock-data";
import { makeLeaf } from "@taigalabs/stope-data-fns";

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

const DATA_PATH = path.resolve("../../source/stope_mock_data/data");
console.log("data_path", DATA_PATH);

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
    let assetsJson = [];
    for (let idx = 0; idx < mockAssets.length; idx += 1) {
      const asset = mockAssets[idx];
      const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
        mockUser.secret,
        asset.isin,
        asset.balance
      );

      const d = {
        leaf: leaf.toJSON(),
        userPublic: userPublic.toJSON(),
        _isin: _isin.toJSON(),
        _balance: _balance.toJSON(),
        _secret: _secret.toJSON(),
      };

      tree.setLeaf(BigInt(idx), leaf);
      assetsJson.push(d);
    }

    const assetsPath = path.resolve(DATA_PATH, "assets.json");
    const treePath = path.resolve(DATA_PATH, "tree.json");
    const root = tree.getRoot();
    const treeJson = { tree: root.toJSON() };
    // const witness = new MerkleWitness20(tree.getWitness(0n));

    fs.writeFileSync(assetsPath, JSON.stringify(assetsJson));
    fs.writeFileSync(treePath, JSON.stringify(treeJson));
  });

  it("bridge_1", async () => {
    await localDeploy();

    const assets = new Assets({ assets: [] });

    // update transaction
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.aggregate(assets);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    // const updatedNum = zkApp.num.get();
    // expect(updatedNum).toEqual(Field(3));
  });
});
