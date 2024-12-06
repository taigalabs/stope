import {
  AccountUpdate,
  Field,
  MerkleTree,
  Mina,
  PrivateKey,
  PublicKey,
} from "o1js";
import {
  Assets,
  HEIGHT,
  MerkleWitness20,
  STOInCircuitType,
} from "@taigalabs/stope-entities";
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
const stosPath = path.resolve(DATA_PATH, "stos.json");
const treePath = path.resolve(DATA_PATH, "tree.json");

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

    let stosJson = [];
    let totalBalance = Field.fromValue(0);
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
    // const witness = new MerkleWitness20(tree.getWitness(0n));

    fs.writeFileSync(stosPath, JSON.stringify(stosJson));
    fs.writeFileSync(treePath, JSON.stringify(treeJson));
  });

  it("bridge_1", async () => {
    await localDeploy();

    const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
    const treeJson = JSON.parse(fs.readFileSync(treePath).toString());

    const stos = stosJson.map((_sto: any) => {
      return {
        userPublic: Field.fromJSON(_sto.userPublic),
        isin: Field.fromJSON(_sto._isin),
        balance: Field.fromJSON(_sto._balance),
      };
    });

    const assets = new Assets({ stos });

    const root = Field.fromJSON(treeJson.root);

    console.log(22, assets, root);

    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.aggregate(assets, root);
    });
    // await txn.prove();
    // await txn.sign([senderKey]).send();

    // const updatedNum = zkApp.num.get();
    // expect(updatedNum).toEqual(Field(3));
  });
});
