import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from "o1js";
// import { mockAssets, mockUser } from "@taigalabs/stope-mock-data";
// import { makeLeaf } from '@taigalabs/stope-data-fns';

import { Bridge } from "./bridge";
import { Assets } from "@taigalabs/stope-entities";

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

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

  it("bridge_1", async () => {
    await localDeploy();

    const assets = new Assets({ assets: [] })

    // for (let asset of mockAssets) {
    //   const { leaf } = makeLeaf(mockUser.secret, asset.isin, asset.balance);
    //   console.log(11, leaf);
    // }

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
